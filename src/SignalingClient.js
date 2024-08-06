import socketIOClient from 'socket.io-client';

class SignalingClient {
  constructor() {
    this.socket = socketIOClient("https://socket.gto.to");
  }

  static shared = new SignalingClient();

  emitDynamicBlockSites(parameters) {
    return new Promise((resolve, reject) => {
      this.socket.emit('dynamicBlockSites', parameters, (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.error);
        }
      });
    });
  }

  emitCloseTheTab(parameters) {
    return new Promise((resolve, reject) => {
      this.socket.emit('closeTheTab', parameters, (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.error);
        }
      });
    });
  }

  emitGetActiveTabUrl(parameters) {
    return new Promise((resolve, reject) => {
      this.socket.emit('getActiveTabUrl', parameters, (response) => {
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.error);
        }
      });
    });
  }
}

export default SignalingClient;
