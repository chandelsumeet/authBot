// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
  ConfirmPrompt,
  DialogSet,
  DialogTurnStatus,
  OAuthPrompt,
  WaterfallDialog,
} = require("botbuilder-dialogs");

const { LogoutDialog } = require("./logoutDialog");
const { QnAMakerDialog } = require("botbuilder-ai");
const CONFIRM_PROMPT = "ConfirmPrompt";
const MAIN_DIALOG = "MainDialog";
const MAIN_WATERFALL_DIALOG = "MainWaterfallDialog";
const OAUTH_PROMPT = "OAuthPrompt";
const QNAMAKER_BASE_DIALOG = "qnamaker-base-dialog";

class MainDialog extends LogoutDialog {
  constructor(rootDialog) {
    super(MAIN_DIALOG, process.env.connectionName);

    if (!rootDialog)
      throw new Error(
        "[MainDialog]: Missing parameter 'rootDialog' is required"
      );
    this.addDialog(
      new OAuthPrompt(OAUTH_PROMPT, {
        connectionName: process.env.connectionName,
        text: "Please Sign In",
        title: "Sign In",
        timeout: 300000,
      })
    );
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
    this.addDialog(rootDialog);
    this.addDialog(
      new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
        this.promptStep.bind(this),
        this.loginStep.bind(this),
      ])
    );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;
  }

  /**
   * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} dialogContext
   */

  async run(context, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }
  // async qnaMaker(stepContext) {
  //   return await stepContext.beginDialog(QNAMAKER_BASE_DIALOG);
  // }
  async promptStep(stepContext) {
    return await stepContext.beginDialog(OAUTH_PROMPT);
  }

  async loginStep(stepContext) {
    // Get the token from the previous step. Note that we could also have gotten the
    // token directly from the prompt itself. There is an example of this in the next method.
    const tokenResponse = stepContext.result;
    if (tokenResponse) {
      await stepContext.context.sendActivity("You are now logged => 4");
      return await stepContext.beginDialog("rootDialog");
    }
    await stepContext.context.sendActivity(
      "Login was not successful please try again."
    );
    return await stepContext.endDialog();
  }
}

module.exports.MainDialog = MainDialog;
