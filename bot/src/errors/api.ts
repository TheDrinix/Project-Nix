export enum ApiErrorType {
  InvalidRequestBody,
  GuildNotFound,
  LobbyNotFound,
  LobbyAlreadyExists,
  ChannelNotInLobby,
  CannotRemoveProtection,
  ForbiddenAction
}

export class ApiError extends Error {
  constructor(public type: ApiErrorType, public msg?: string) {
    let message = msg;
    if (!message) {
      switch (type) {
        case ApiErrorType.InvalidRequestBody:
          message = 'Invalid request body';
          break;
        case ApiErrorType.GuildNotFound:
          message = 'Guild not found';
          break;
        case ApiErrorType.LobbyNotFound:
          message = 'Lobby not found';
          break;
        case ApiErrorType.LobbyAlreadyExists:
          message = 'Lobby already exists';
          break;
        case ApiErrorType.ChannelNotInLobby:
          message = 'The channel is not within a lobby';
          break;
        case ApiErrorType.CannotRemoveProtection:
          message = 'Cannot remove protection from entrypoint channel or waiting room';
          break;
        case ApiErrorType.ForbiddenAction:
          message = 'Forbidden action';
          break;
        default:
          message = 'An error occurred';
      }
    }

    super(message);
  }
}