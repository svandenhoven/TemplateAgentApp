import { MemoryStorage } from "botbuilder";
import * as path from "path";
import config from "../config";

// See https://aka.ms/teams-ai-library to learn more about the Teams AI library.
import { Application, ActionPlanner, OpenAIModel, PromptManager } from "@microsoft/teams-ai";
import { ApplicationTurnState } from "./turnState";
import { resetMessage } from "./messages";

// Begin <<Import actions>>
import { createTask } from "./actions";
import { deleteTask } from "./actions";
// End <<Import actions>>

// Create AI components
const model = new OpenAIModel({
  azureApiKey: config.azureOpenAIKey,
  azureDefaultDeployment: config.azureOpenAIDeploymentName,
  azureEndpoint: config.azureOpenAIEndpoint,

  useSystemMessages: true,
  logRequests: true,
});
const prompts = new PromptManager({
  promptsFolder: path.join(__dirname, "../prompts"),
});
const planner = new ActionPlanner<ApplicationTurnState>({
  model,
  prompts,
  defaultPrompt: "planner",
});

// Define storage and application
const storage = new MemoryStorage();
const app = new Application<ApplicationTurnState>({
  storage,
  ai: {
    planner,
  },
});

app.message("/reset", resetMessage);

// <<Actions Begin>>
app.ai.action("createTask", createTask);
app.ai.action("deleteTask", deleteTask);
// <<Actions End>>  


export default app;
