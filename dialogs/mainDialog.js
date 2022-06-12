const {
  ConfirmPrompt,
  DialogSet,
  DialogTurnStatus,
  OAuthPrompt,
  WaterfallDialog,
} = require("botbuilder-dialogs");
const { MessageFactory } = require("botbuilder");
const { LogoutDialog } = require("./logoutDialog");
const { QnAMakerDialog } = require("botbuilder-ai");
const CONFIRM_PROMPT = "ConfirmPrompt";
const MAIN_DIALOG = "MainDialog";
const MAIN_WATERFALL_DIALOG = "MainWaterfallDialog";
const OAUTH_PROMPT = "OAuthPrompt";
const QNAMAKER_BASE_DIALOG = "qnamaker-base-dialog";
const axios = require("axios");
const createQnAMakerDialog = (
  knowledgeBaseId,
  endpointKey,
  endpointHostName,
  defaultAnswer
) => {
  let noAnswerActivity;
  if (typeof defaultAnswer === "string") {
    noAnswerActivity = MessageFactory.text(defaultAnswer);
  }

  const qnaMakerDialog = new QnAMakerDialog(
    knowledgeBaseId,
    endpointKey,
    endpointHostName,
    noAnswerActivity
  );
  qnaMakerDialog.id = QNAMAKER_BASE_DIALOG;

  return qnaMakerDialog;
};
let qnaToken = false;
let oldToken = "";
class MainDialog extends LogoutDialog {
  constructor(knowledgeBaseId, endpointKey, endpointHostName, defaultAnswer) {
    super(MAIN_DIALOG, process.env.connectionName);

    this.addDialog(
      new OAuthPrompt(OAUTH_PROMPT, {
        connectionName: process.env.connectionName,
        text: "Please Sign In",
        title: "Sign In",
        timeout: 300000,
      })
    );
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
    this.addDialog(
      new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
        this.promptStep.bind(this),
        this.loginStep.bind(this),
        this.qnaMaker.bind(this),
      ])
    );
    this.addDialog(
      createQnAMakerDialog(
        knowledgeBaseId,
        endpointKey,
        endpointHostName,
        defaultAnswer
      )
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

  async qnaMaker(stepContext) {
    qnaToken = true;
    const result = await stepContext.context._activity.text;
    let response;
    const tokenResponse = stepContext.result;
    try {
      await axios
        .get("https://graph.microsoft.com/v1.0/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenResponse.token,
          },
        })
        .then((res) => (response = res))
        .catch((error) => (response = error));
      await stepContext.context.sendActivity(`called api`);
      await stepContext.context.sendActivity(`${tokenResponse.token}`);
      await stepContext.context.sendActivity(
        MessageFactory.text(response, response)
      );
      //await stepContext.context.sendActivity(MessageFactory.text(response));
    } catch (error) {
      await stepContext.context.sendActivity(`error->${error}`);
    }

    // return await stepContext.beginDialog(QNAMAKER_BASE_DIALOG);
  }
  async promptStep(stepContext) {
    console.log("context");
    return await stepContext.beginDialog(OAUTH_PROMPT);
  }

  async loginStep(stepContext) {
    // Get the token from the previous step. Note that we could also have gotten the
    // token directly from the prompt itself. There is an example of this in the next method.
    const tokenResponse = stepContext.result;
    if (tokenResponse && qnaToken === false) {
      await stepContext.context.sendActivity("You are now logged in . Thanks");
      return await await stepContext.beginDialog(OAUTH_PROMPT);
    } else if (tokenResponse && qnaToken === true) {
      return await stepContext.beginDialog(OAUTH_PROMPT);
    }
    await stepContext.context.sendActivity(
      "Login was not successful please try again."
    );
    return await stepContext.endDialog();
  }
}

module.exports.MainDialog = MainDialog;
