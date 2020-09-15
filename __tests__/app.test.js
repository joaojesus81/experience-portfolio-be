const request = require("supertest");
const app = require("../app");
const knex = require("../connection");

describe("app", () => {
  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(() => {
    return knex.destroy();
  });

  test("ALL: 404 - non existent path", () => {
    return request(app)
      .get("/not-a-route")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found! :-(");
      });
  });
  describe("/api", () => {
    test("GET: 200 - responds with a JSON object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              "GET /api": expect.any(Object),
            })
          );
        });
    });
    describe("/staff", () => {
      describe("/staff/meta/", () => {
        describe("/staff/meta/:StaffID", () => {
          test("GET: 200 - check staffmember exists and fetch meta data for an individual", () => {
            return request(app)
              .get("/api/staff/meta/37704")
              .expect(200)
              .then(({ body: { staffMeta } }) => {
                expect(staffMeta).toEqual({
                  StaffID: 37704,
                  StaffName: "Samuel Styles",
                  Email: "Sam.Styles@arup.com",
                  LocationName: "Manchester Office",
                  StartDate: "2007-09-05T23:00:00.000Z",
                  JobTitle: "Senior Engineer",
                  GradeLevel: 6,
                  DisciplineName: "Structural Engineering",
                  imgUrl: null,
                  careerStart: null,
                  nationality: null,
                  highLevelDescription: null,
                  valueStatement: null,
                  qualifications: null,
                  professionalAssociations: null,
                  committees: null,
                  publications: null,
                });
              });
          });
          test("GET: 404 - staffmember doesn't exist in the database", () => {
            const apiString = `/api/staff/meta/99999`;
            return request(app)
              .get(apiString)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("StaffID not found");
              });
          });
          test("GET: 400 - bad StaffID", () => {
            return request(app)
              .get("/api/staff/meta/samstyles")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("PATCH: 200 - update StaffMeta - works with nationality", () => {
            return request(app)
              .patch("/api/staff/meta/37704")
              .send({ nationality: "British" })
              .expect(200)
              .then(({ body: { staffMeta } }) => {
                expect(staffMeta).toEqual({
                  StaffID: 37704,
                  StaffName: "Samuel Styles",
                  Email: "Sam.Styles@arup.com",
                  LocationName: "Manchester Office",
                  StartDate: "2007-09-05T23:00:00.000Z",
                  JobTitle: "Senior Engineer",
                  GradeLevel: 6,
                  DisciplineName: "Structural Engineering",
                  imgUrl: null,
                  careerStart: null,
                  nationality: "British",
                  highLevelDescription: null,
                  valueStatement: null,
                  qualifications: null,
                  professionalAssociations: null,
                  committees: null,
                  publications: null,
                });
              });
          });
          test("PATCH: 200 - update StaffMeta - works with other attributes", () => {
            return request(app)
              .patch("/api/staff/meta/37704")
              .send({
                imgUrl: "www.samstyles.com",
                careerStart: "2007-09-05T21:00:00.000Z",
                highLevelDescription: "Sam operates at a VERY high level",
                valueStatement: "Sam adds lots of value",
                nationality: "British",
              })
              .expect(200)
              .then(({ body: { staffMeta } }) => {
                expect(staffMeta).toEqual({
                  StaffID: 37704,
                  StaffName: "Samuel Styles",
                  Email: "Sam.Styles@arup.com",
                  LocationName: "Manchester Office",
                  StartDate: "2007-09-05T23:00:00.000Z",
                  JobTitle: "Senior Engineer",
                  GradeLevel: 6,
                  DisciplineName: "Structural Engineering",
                  imgUrl: "www.samstyles.com",
                  careerStart: "2007-09-05T21:00:00.000Z",
                  highLevelDescription: "Sam operates at a VERY high level",
                  valueStatement: "Sam adds lots of value",
                  nationality: "British",
                  qualifications: null,
                  professionalAssociations: null,
                  committees: null,
                  publications: null,
                });
              });
          });
          test("PATCH: 422 - cannot update StaffID", () => {
            //Should there be anything else we can't change?
            return request(app)
              .patch("/api/staff/meta/37704")
              .send({
                StaffID: 999999,
              })
              .expect(422)
              .then(() => {
                return request(app).get("/api/staff/meta/37704").expect(200);
              });
          });
          //Handle the below on the front end.
          // test("PATCH: 422 - cannot update other Arup projects fields", () => {
          //   return request(app)
          //     .patch("/api/staff/meta/37704")
          //     .send({
          //       StaffName: "Samuel Styles",
          //       Email: "Sam.Styles@arup.com",
          //       LocationName: "Manchester Office",
          //       StartDate: "2007-09-05T23:00:00.000Z",
          //       JobTitle: "Senior Engineer",
          //       GradeLevel: 6,
          //       DisciplineName: "Structural Engineering",
          //     })
          //     .expect(422)
          //     .then(({ body: { msg } }) => {
          //       expect(msg).toBe(
          //         "Arup projects fields should be updated on central systems!!!"
          //       );
          //     });
          // });
          test("PATCH: 404 - staffmember doesn't exist in the database", () => {
            return request(app)
              .patch(`/api/staff/meta/99999`)
              .send({
                imgUrl: "www.samstyles.com",
                careerStart: "2007-09-05T21:00:00.000Z",
                highLevelDescription: "Sam operates at a VERY high level",
                valueStatement: "Sam adds lots of value",
                nationality: "British",
              })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("StaffID not found");
              });
          });
          test("PATCH: 400 - bad StaffID", () => {
            return request(app)
              .patch("/api/staff/meta/samstyles")
              .send({
                imgUrl: "www.samstyles.com",
                careerStart: "2007-09-05T21:00:00.000Z",
                highLevelDescription: "Sam operates at a VERY high level",
                valueStatement: "Sam adds lots of value",
                nationality: "British",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("PATCH: 400 - non-existent attribute", () => {
            return request(app)
              .patch(`/api/staff/meta/37704`)
              .send({
                newPic: "www.samstyles.com",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("INVALID METHODS: 405 error", () => {
            const invalidMethods = ["put", "post", "delete"];
            const endPoint = "/api/staff/meta/37704";
            const promises = invalidMethods.map((method) => {
              return request(app)
                [method](endPoint)
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed!!!");
                });
            });
            return Promise.all(promises);
          });
        });
      });
    });
    describe("/projects", () => {
      describe("/projects/staff/:StaffID", () => {
        test("GET: 200 - check staffmember exists and fetch project list for an individual", () => {
          return request(app)
            .get("/api/projects/staff/37704")
            .expect(200)
            .then(({ body: { projects } }) => {
              expect(projects).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    ProjectCode: expect.any(Number),
                    StaffID: 37704,
                    TotalHrs: expect.any(Number),
                    experience: null,
                    experienceID: expect.any(Number),
                  }),
                ])
              );
            });
        });
        test("GET: 200 - check staffmember exists and fetch project details for an individual", () => {
          return request(app)
            .get("/api/projects/staff/37704?showDetails=true")
            .expect(200)
            .then(({ body: { projects } }) => {
              expect(projects).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    ProjectCode: expect.any(Number),
                    StaffID: 37704,
                    TotalHrs: expect.any(Number),
                    experience: null,
                    experienceID: expect.any(Number),
                    JobNameLong: expect.any(String),
                    ClientName: expect.any(String),
                  }),
                ])
              );
            });
        });
        test("GET: 404 - staffmember doesn't exist in the database", () => {
          const apiString = `/api/projects/staff/99999`;
          return request(app)
            .get(apiString)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("GET: 400 - bad StaffID", () => {
          return request(app)
            .get("/api/projects/staff/samstyles")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "post", "delete"];
          const endPoint = "/api/projects/staff/37704";
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
        });
      });
    });
    describe("/project", () => {
      describe("/project/:ProjectCode", () => {
        test("GET: 200 - get project details by project code", () => {
          return request(app)
            .get("/api/project/22398800")
            .expect(200)
            .then(({ body: { project } }) => {
              expect(project).toEqual({
                ProjectCode: 22398800,
                JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
                StartDate: "2012-03-23T12:00:00.000Z",
                EndDate: "2020-08-30T11:00:00.000Z",
                CentreName: "Buildings NW & Yorkshire",
                AccountingCentreCode: 1419,
                PracticeName: "Building Engineering",
                BusinessCode: "BC03",
                BusinessName: "Property",
                ProjectDirectorID: 29952,
                ProjectDirectorName: "Matthew Holden",
                ProjectManagerID: 37704,
                ProjectManagerName: "Samuel Styles",
                CountryName: "England",
                Town: "Warrington",
                ScopeOfService:
                  "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
                ScopeOfWorks:
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: true,
                imageURL: null,
              });
            });
        });
        test("GET: 200 - accepts staff no as a query", () => {
          return request(app)
            .get("/api/project/22398800?StaffID=37704")
            .expect(200)
            .then(({ body: { project } }) => {
              expect(project).toEqual({
                ProjectCode: 22398800,
                JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
                StartDate: "2012-03-23T12:00:00.000Z",
                EndDate: "2020-08-30T11:00:00.000Z",
                CentreName: "Buildings NW & Yorkshire",
                AccountingCentreCode: 1419,
                PracticeName: "Building Engineering",
                BusinessCode: "BC03",
                BusinessName: "Property",
                ProjectDirectorID: 29952,
                ProjectDirectorName: "Matthew Holden",
                ProjectManagerID: 37704,
                ProjectManagerName: "Samuel Styles",
                CountryName: "England",
                Town: "Warrington",
                ScopeOfService:
                  "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
                ScopeOfWorks:
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: true,
                imageURL: null,
                StaffID: 37704,
                TotalHrs: 3730.75,
                experience: null,
                experienceID: expect.any(Number),
              });
            });
        });
        test("GET: 404 - staffmember doesn't exist in the database", () => {
          return request(app)
            .get("/api/project/22398800?StaffID=999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("GET: 400 - bad StaffID", () => {
          return request(app)
            .get("/api/project/22398800?StaffID=samstyles")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("PATCH: 200 - add staff experience to project", () => {
          return request(app)
            .patch("/api/project/22398800?StaffID=37704")
            .send({ experience: "Sam worked really hard on this project." })
            .expect(200)
            .then(({ body: { project } }) => {
              expect(project).toEqual({
                ProjectCode: 22398800,
                JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
                StartDate: "2012-03-23T12:00:00.000Z",
                EndDate: "2020-08-30T11:00:00.000Z",
                CentreName: "Buildings NW & Yorkshire",
                AccountingCentreCode: 1419,
                PracticeName: "Building Engineering",
                BusinessCode: "BC03",
                BusinessName: "Property",
                ProjectDirectorID: 29952,
                ProjectDirectorName: "Matthew Holden",
                ProjectManagerID: 37704,
                ProjectManagerName: "Samuel Styles",
                CountryName: "England",
                Town: "Warrington",
                ScopeOfService:
                  "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
                ScopeOfWorks:
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: true,
                imageURL: null,
                StaffID: 37704,
                TotalHrs: 3730.75,
                experience: "Sam worked really hard on this project.",
                experienceID: expect.any(Number),
              });
            });
        });
        test("PATCH: 404 - cannot patch staff experience if no time row exists", () => {
          return request(app)
            .patch("/api/project/25397800?StaffID=37704")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe(
                "No staff time booked to project - use add experience instead!!!"
              );
            });
        });
        test("PATCH: 404 - staffmember doesn't exist in the database", () => {
          return request(app)
            .patch("/api/project/25397800?StaffID=99999")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("PATCH: 400 - bad StaffID", () => {
          return request(app)
            .patch("/api/project/25397800?StaffID=samstyles")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("PATCH: 400 - non-existent attribute", () => {
          return request(app)
            .patch("/api/project/25397800?StaffID=37704")
            .send({
              newPic: "www.samstyles.com",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "post", "delete"];
          const endPoint = "/api/project/25397800";
          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
        });
        // test("POST: 201 - adds staff experience  if no time row exists", () => {
        //   return request(app)
        //     .post("/api/project/25397800?StaffID=37704")
        //     .send({
        //       TotalHrs: 5,
        //       experience: "Sam worked really hard on this project.",
        //     })
        //     .expect(200)
        //     .then(({ body: { project } }) => {
        //       expect(project).toEqual({
        //         ProjectCode: 25397800,
        //         JobNameLong: "JLR PROJECT CHURCHILL CONSTRUCTION STAGE",
        //         StartDate: "14/02/2017",
        //         EndDate: "31/03/2020",
        //         CentreName: "Buildings Midlands",
        //         AccountingCentreCode: "01181",
        //         PracticeName: "Building Engineering",
        //         BusinessCode: "BC17",
        //         BusinessName: "Science, Industry & Technology",
        //         ProjectDirectorID: 7389,
        //         ProjectDirectorName: "Daniel Goodreid",
        //         ProjectManagerID: 42621,
        //         ProjectManagerName: "Philip Hives",
        //         CountryName: "England",
        //         Town: "COVENTRY",
        //         ScopeOfService:
        //           "Civil, structural, mechanical, electrical, and public health engineering, geotechnical, fire, and acoustics services. Preparation of technical design (RIBA Stage 4) for a D&B Contractor (Skanska).",
        //         ScopeOfWorks:
        //           "NB: External enquiries to be directed to the main contractor.\n\nJaguar Land Rover (JLR) approached Arup to assist in realising their vision for the Coventry site to become a world class powertrain centre of excellence, providing high quality powertrain solutions to meet their global product cycle plan. Following the tendering stage Arup was appointed by the contractor as multi-disciplinary engineering designers in charge of technical design (RIBA Stage 4) Drawing on our successful delivery of the Engine Manufacturing Centre in Wolverhampton, Arup provided multi-disciplinary designs for the creation of a new Powertrain and Development Centre to incorporate testing and support facilities including: Powertrain Test Cells; Chassis Dynamometer Test Cells; Cycle Simulation Test Cells; Mechanical Development Test Cells; Calibration / Performance & Emission Test Cells; Component Testing; Hybrid Test Cells; Support Areas and Office Accommodation for Powertrain Engineers.\n\nThe project achieved a BREEAM rating of excellence.",
        //         Latitude: 52.381111,
        //         Longitude: -1.486389,
        //         State: "WEST MIDLANDS",
        //         PercentComplete: 100,
        //         ClientID: 8868,
        //         ClientName: "Skanska Construction Company Ltd",
        //         ProjectURL:
        //           "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=25397800",
        //         Confidential: 0,
        //         TotalHrs: null,
        //         experience: "Sam worked really hard on this project.",
        //         experienceID: expect.any(Number),
        //       });
        //     });
        // });
      });
    });
  });
});
