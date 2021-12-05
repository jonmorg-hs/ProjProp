const propertiesRoutes = require("../controllers/api/properties-routes");
const testData = require("./radiusSearch.test-data");

describe("Given a user provides his current location and search radius is set to 13 kms", () => {
  describe("When he initiates a search by radius", () => {
    it("Then it should return one registered property with a registered event", () => {
      const user_id = 1;
      const req = testData.radiusSearchRequest13Km;

      const filteredData = propertiesRoutes.radiusSearch(
        testData.allProperties,
        req.lat,
        req.lng,
        user_id,
        req.radius
      );

      expect(filteredData.length).toEqual(1);
      expect(filteredData[0].address).toEqual("35 Otterington Grove, Ivanhoe");
    });
  });
});

describe("Given a user provides his current location and search radius is set to 18 kms", () => {
  describe("When he initiates a search by radius", () => {
    it("Then it should return three registered properties with a registered event", () => {
      const user_id = 1;
      const req = testData.radiusSearchRequest18Km;

      const filteredData = propertiesRoutes.radiusSearch(
        testData.allProperties,
        req.lat,
        req.lng,
        user_id,
        req.radius
      );

      expect(filteredData.length).toEqual(3);
      expect(filteredData[0].address).toEqual("35 Otterington Grove, Ivanhoe");
      expect(filteredData[1].address).toEqual("150 The Boulevard, Ivanhoe");
      expect(filteredData[2].address).toEqual("158 The Boulevard, Ivanhoe");
    });
  });
});

describe("Given a user provides his current location and search radius is set to 7 kms", () => {
  describe("When he initiates a search by radius", () => {
    it("Then it should return zero registered properties", () => {
      const user_id = 1;
      const req = testData.radiusSearchRequest7Km;

      const filteredData = propertiesRoutes.radiusSearch(
        testData.allProperties,
        req.lat,
        req.lng,
        user_id,
        req.radius
      );

      expect(filteredData.length).toEqual(0);
    });
  });
});
