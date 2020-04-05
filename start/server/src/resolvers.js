const { paginateResults } = require('./utils');

module.exports = {
    Query: {
        latestReadingByBeerID: (_, { id }, { dataSources}) =>
        dataSources.monitorAPI.getlatestReadingByBeerID({beerId: id}),
        //readingsByBeerID: (_, { id }, { dataSources}) =>
        //dataSources.monitorAPI.getReadingByBeerID({beerId: id}),

        readingsByBeerID: async (_, { pageSize = 20, after, id }, { dataSources }) => {
            const allReadings = await dataSources.monitorAPI.getReadingByBeerID({beerId: id});
            // we want these in reverse chronological order
            allReadings.reverse();
            const readingsByBeerID = paginateResults({
              after,
              pageSize,
              results: allReadings
            });
            return {
              readingsByBeerID,
              cursor: readingsByBeerID.length ? readingsByBeerID[readingsByBeerID.length - 1].cursor : null,
              // if the cursor of the end of the paginated results is the same as the
              // last item in _all_ results, then there are no more results after this
              hasMore: readingsByBeerID.length
                ? readingsByBeerID[readingsByBeerID.length - 1].cursor !==
                  allReadings[allReadings.length - 1].cursor
                : false
            };
          },

        hydrometers: (_, __, { dataSources}) =>
        dataSources.monitorAPI.getHydrometers(),

        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            // we want these in reverse chronological order
            allLaunches.reverse();
            const launches = paginateResults({
              after,
              pageSize,
              results: allLaunches
            });
            return {
              launches,
              cursor: launches.length ? launches[launches.length - 1].cursor : null,
              // if the cursor of the end of the paginated results is the same as the
              // last item in _all_ results, then there are no more results after this
              hasMore: launches.length
                ? launches[launches.length - 1].cursor !==
                  allLaunches[allLaunches.length - 1].cursor
                : false
            };
          },
        launch: (_, { id }, { dataSources }) =>
        dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    }
  };