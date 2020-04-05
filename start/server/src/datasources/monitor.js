const { RESTDataSource } = require('apollo-datasource-rest');

class MonitorAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://tiltmonitorapplication.ap-southeast-2.elasticbeanstalk.com/tilt/';
  }

  async getlatestReadingByBeerID({ beerId }) {
    const response = await this.get(`reading/${beerId}/latest`);
    return this.readingReducer(response);
  }

  async getReadingByBeerID({ beerId }) {
    const response = await this.get(`reading/${beerId}/`);
     // transform the raw readings to a more friendly
    return Array.isArray(response)
    ? response.map(reading => this.readingReducer(reading)) : [];
  }

  async getHydrometers() {
    const response = await this.get(`hydrometer`);
    // transform the raw readings to a more friendly
    return Array.isArray(response)
    ? response.map(hydrometer => this.hydrometerReducer(hydrometer)) : [];
  }

readingReducer(reading) {
    return {
      id: reading.readingID || 0,
      beerId: reading.beerID || 0,
      hydrometerId: reading.hydrometerID || 0,
      temp: reading.temp || 0,
      date: `${reading.date}`,
      sg: reading.sg || 0,
    }; 
  } 
  hydrometerReducer(hydrometer) {
    return {
      id: hydrometer.hydrometerID || 0,
      colour: hydrometer.colour || "",
      inUse: hydrometer.inUse || false,
      available: hydrometer.available || false,
    };
  }
}

module.exports = MonitorAPI;