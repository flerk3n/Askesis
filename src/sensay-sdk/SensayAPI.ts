/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { ApiKeysService } from './services/ApiKeysService';
import { ChatCompletionsService } from './services/ChatCompletionsService';
import { ChatHistoryService } from './services/ChatHistoryService';
import { ChatWidgetIntegrationService } from './services/ChatWidgetIntegrationService';
import { DiscordIntegrationService } from './services/DiscordIntegrationService';
import { ExperimentalService } from './services/ExperimentalService';
import { ReplicasService } from './services/ReplicasService';
import { TelegramIntegrationService } from './services/TelegramIntegrationService';
import { TrainingService } from './services/TrainingService';
import { UsersService } from './services/UsersService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class SensayAPI {
    public readonly apiKeys: ApiKeysService;
    public readonly chatCompletions: ChatCompletionsService;
    public readonly chatHistory: ChatHistoryService;
    public readonly chatWidgetIntegration: ChatWidgetIntegrationService;
    public readonly discordIntegration: DiscordIntegrationService;
    public readonly experimental: ExperimentalService;
    public readonly replicas: ReplicasService;
    public readonly telegramIntegration: TelegramIntegrationService;
    public readonly training: TrainingService;
    public readonly users: UsersService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'https://api.sensay.io',
            VERSION: config?.VERSION ?? '2025-03-25',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.apiKeys = new ApiKeysService(this.request);
        this.chatCompletions = new ChatCompletionsService(this.request);
        this.chatHistory = new ChatHistoryService(this.request);
        this.chatWidgetIntegration = new ChatWidgetIntegrationService(this.request);
        this.discordIntegration = new DiscordIntegrationService(this.request);
        this.experimental = new ExperimentalService(this.request);
        this.replicas = new ReplicasService(this.request);
        this.telegramIntegration = new TelegramIntegrationService(this.request);
        this.training = new TrainingService(this.request);
        this.users = new UsersService(this.request);
    }
}

