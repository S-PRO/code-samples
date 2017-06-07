// @flow
import { Linking } from 'react-native';
import urlParse from 'url-parse';

export default class LinkChecker {
  constructor(callback: Function) {
    Linking.getInitialURL()
      .then((url: string | null) => {
        if (url) {
          const parsedUrl = urlParse(url, true);
          callback(parsedUrl);
        }
      })
      .catch((error: {}) => {
        console.warn('LinkChecker getInitialUrl error: ', error);
      });

    this._addListener(callback);
  }

  _addListener(callback: Function) {
    Linking.addEventListener("url", (event: { url: string }) => {
      const parsedUrl = urlParse(event.url, true);
      callback(parsedUrl);
    });
  }

}
