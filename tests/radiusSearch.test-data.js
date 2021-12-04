const radiusSearchRequest13Km = {
  radius: "13",
  lat: -37.89227,
  lng: 145.060374,
  event_id: "1",
};

const radiusSearchRequest18Km = {
  radius: "18",
  lat: -37.89227,
  lng: 145.060374,
  event_id: "1",
};

const radiusSearchRequest7Km = {
  radius: "7",
  lat: -37.89227,
  lng: 145.060374,
  event_id: "1",
};

const allProperties = [
  {
    id: 1,
    address: "35 Otterington Grove, Ivanhoe",
    latitude: -37.7767,
    longitude: 145.056,
    event: {
      id: 1,
      event_id: 1,
      event_start_dt: "2021-12-23T00:00:00.000Z",
      event_end_dt: "2021-12-24T13:00:00.000Z",
      event_start_time: "02:30:00",
      event_end_time: "10:30:00",
      eventtype: {
        title: "Xmas Lights",
      },
    },
    reviews: [
      {
        user_id: 1,
        property_id: 1,
        event_like: true,
      },
    ],
  },
  {
    id: 2,
    address: "150 The Boulevard, Ivanhoe",
    latitude: -37.7735,
    longitude: 145.051,
    event: {
      id: 2,
      event_id: 1,
      event_start_dt: "2021-12-04T00:00:26.000Z",
      event_end_dt: "2021-12-04T00:00:26.000Z",
      event_start_time: "00:00:00",
      event_end_time: "00:00:00",
      eventtype: {
        title: "Xmas Lights",
      },
    },
    reviews: [
      {
        user_id: 2,
        property_id: 2,
        event_like: true,
      },
    ],
  },
  {
    id: 3,
    address: "158 The Boulevard, Ivanhoe",
    latitude: -37.7738,
    longitude: 145.051,
    event: {
      id: 3,
      event_id: 1,
      event_start_dt: "2021-12-04T00:00:26.000Z",
      event_end_dt: "2021-12-04T00:00:26.000Z",
      event_start_time: "00:00:00",
      event_end_time: "00:00:00",
      eventtype: {
        title: "Xmas Lights",
      },
    },
    reviews: [
      {
        user_id: 3,
        property_id: 3,
        event_like: true,
      },
    ],
  },
];

module.exports = {
  allProperties,
  radiusSearchRequest13Km,
  radiusSearchRequest18Km,
  radiusSearchRequest7Km,
};
