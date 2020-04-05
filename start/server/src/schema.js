const { gql } = require('apollo-server');

const typeDefs = gql`
  # Your schema will go here
  type Query {
      launches(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
      ): LaunchConnection!
      launch(id: ID!): Launch
      me: User
      
      latestReadingByBeerID(id: ID!): Reading
      readingsByBeerID(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
      id: ID!
    ): ReadingConnection!


      hydrometers: [Hydrometer]!
  }
  
  type Mutation {
      bookTrips(launchIds: [ID]!): TripUpdateResponse!
      cancelTrip(launchId: ID!): TripUpdateResponse!
      login(email: String): String # login token   
  }

"""
Simple wrapper around our list of launches that contains a cursor to the
last item in the list. Pass this cursor to the launches query to fetch results
after these.
"""
type LaunchConnection { 
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}

type ReadingConnection { 
  cursor: String!
  hasMore: Boolean!
  readingsByBeerID(id: ID!): [Reading]!
}

  type TripUpdateResponse {
      success: Boolean!
      message: String
      launches: [Launch]
  }
  type Reading {
      id: ID!
      beerId: ID!
      hydrometerId: ID!
      temp: Float
      date: String
      sg: Float
  }
  type Hydrometer {
      id: ID!
      colour: String
      inUse: Boolean
      available: Boolean
  }

  #Tutorial Code
  type Launch {
      id: ID!
      site: String
      mission: Mission
      rocket: Rocket
      isBooked: Boolean!
  }
  type Rocket {
    id: ID!
    name: String
    type: String
  }
  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }
  type Mission {
      name: String
      missionPatch(size: PatchSize): String
  }
  enum PatchSize {
  SMALL
  LARGE
}

`;

module.exports = typeDefs;