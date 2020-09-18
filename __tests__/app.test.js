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
      describe("/staff/login", () => {
        test("POST: 200 - returns staff credentials", () => {
          return request(app)
            .post("/api/staff/login")
            .send({ StaffID: 37704 })
            .expect(200)
            .then(({ body: { credentials } }) => {
              expect(credentials.StaffID).toBe(37704);
              expect(credentials.GradeLevel).toBe(6);
              expect(credentials.ProjectManagerFor).toEqual([
                22398800,
                22596300,
                24625900,
                25394200,
                26766100,
              ]);
            });
        });
        test("POST: 200 - returns staff credentials if no PM projects", () => {
          return request(app)
            .post("/api/staff/login")
            .send({ StaffID: 56876 })
            .expect(200)
            .then(({ body: { credentials } }) => {
              expect(credentials.StaffID).toBe(56876);
              expect(credentials.GradeLevel).toBe(4);
              expect(credentials.ProjectManagerFor).toEqual([]);
            });
        });
        test("POST: 404 - no staff_id provided", () => {
          return request(app)
            .post("/api/staff/login")
            .send({
              TotalHrs: 5,
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("POST: 404 - no body sent", () => {
          return request(app)
            .post("/api/staff/login")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("POST: 400 - bad StaffID", () => {
          return request(app)
            .post("/api/staff/login")
            .send({
              StaffID: "samstyles",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("POST: 404 - non-existent StaffID", () => {
          return request(app)
            .post("/api/staff/login")
            .send({
              StaffID: 999999,
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "get", "delete"];
          const endPoint = "/api/staff/login";
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

      describe("/staff/meta/", () => {
        test("GET: 200 - returns a list of staff and their metadata", () => {
          return request(app)
            .get("/api/staff/meta")
            .expect(200)
            .then(({ body: { staffMeta } }) => {
              expect(staffMeta).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    StaffID: expect.any(Number),
                    StaffName: expect.any(String),
                    Email: expect.any(String),
                    StaffID: expect.any(Number),
                    LocationName: expect.any(String),
                    StartDate: expect.any(String),
                    JobTitle: expect.any(String),
                    GradeLevel: expect.any(Number),
                    DisciplineName: expect.any(String),
                  }),
                ])
              );
              expect(staffMeta.length).toBe(3);
            });
        });
        test("GET: 200 - list accepts filters", () => {
          return request(app)
            .get("/api/staff/meta?GradeLevel=5")
            .expect(200)
            .then(({ body: { staffMeta } }) => {
              expect(staffMeta).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    StaffID: expect.any(Number),
                    StaffName: expect.any(String),
                    Email: expect.any(String),
                    StaffID: expect.any(Number),
                    LocationName: expect.any(String),
                    StartDate: expect.any(String),
                    JobTitle: expect.any(String),
                    GradeLevel: expect.any(Number),
                    DisciplineName: expect.any(String),
                  }),
                ])
              );
              expect(staffMeta.length).toBe(1);
            });
        });
        test("GET: 400 - nonsense filter ", () => {
          return request(app)
            .get("/api/staff/meta?Sam=Cool")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "post", "delete"];
          const endPoint = "/api/staff/meta";
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
                  imgURL: null,
                  careerStart: null,
                  nationality: null,
                  highLevelDescription: null,
                  valueStatement: null,
                  qualifications: [],
                  professionalAssociations: [],
                  committees: [],
                  publications: [],
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
                  imgURL: null,
                  careerStart: null,
                  nationality: "British",
                  highLevelDescription: null,
                  valueStatement: null,
                  qualifications: [],
                  professionalAssociations: [],
                  committees: [],
                  publications: [],
                });
              });
          });
          test("PATCH: 200 - update StaffMeta - works with other attributes", () => {
            return request(app)
              .patch("/api/staff/meta/37704")
              .send({
                imgURL: "www.samstyles.com",
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
                  imgURL: "www.samstyles.com",
                  careerStart: "2007-09-05T21:00:00.000Z",
                  highLevelDescription: "Sam operates at a VERY high level",
                  valueStatement: "Sam adds lots of value",
                  nationality: "British",
                  qualifications: [],
                  professionalAssociations: [],
                  committees: [],
                  publications: [],
                });
              });
          });
          test("PATCH: 200 - update StaffMeta - works with array attributes", () => {
            return request(app)
              .patch("/api/staff/meta/37704")
              .send({
                imgURL: "www.samstyles.com",
                careerStart: "2007-09-05T21:00:00.000Z",
                highLevelDescription: "Sam operates at a VERY high level",
                valueStatement: "Sam adds lots of value",
                nationality: "British",
                professionalAssociations: [
                  "Qualification 1",
                  "Qualification 2",
                ],
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
                  imgURL: "www.samstyles.com",
                  careerStart: "2007-09-05T21:00:00.000Z",
                  highLevelDescription: "Sam operates at a VERY high level",
                  valueStatement: "Sam adds lots of value",
                  nationality: "British",
                  qualifications: [],
                  professionalAssociations: [
                    "Qualification 1",
                    "Qualification 2",
                  ],
                  committees: [],
                  publications: [],
                });
              });
          });
          test("PATCH: 422 - cannot update StaffID", () => {
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
          test("PATCH: 404 - staffmember doesn't exist in the database", () => {
            return request(app)
              .patch(`/api/staff/meta/99999`)
              .send({
                imgURL: "www.samstyles.com",
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
                imgURL: "www.samstyles.com",
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
          // test("POST: 200 - add Staffimage and update imgURL", () => { //tested using insomnia });
          test("POST: 400 - cannot be used to post anything other than a file", () => {
            return request(app)
              .post("/api/staff/meta/37704")
              .send({ nationality: "British" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("no files provided");
              });
          });
          // test("POST: 404 - file rejected by cloudinary", () => { //tested using insomnia });
          // test("POST: 400 - bad StaffID", () => { //tested using insomnia });
          test("INVALID METHODS: 405 error", () => {
            const invalidMethods = ["put", "delete"];
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
      test("GET: 200 - returns a list of all projects", () => {
        return request(app)
          .get("/api/projects")
          .expect(200)
          .then(({ body: { projects } }) => {
            expect(projects).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ProjectCode: expect.any(Number),
                  JobNameLong: expect.any(String),
                  PracticeName: expect.any(String),
                  Confidential: expect.any(Boolean),
                }),
              ])
            );
          });
      });
      test("GET: 200 - returns a list of all projects filtered by ClientName", () => {
        return request(app)
          .get("/api/projects?ClientName=Network Rail Limited")
          .expect(200)
          .then(({ body: { projects } }) => {
            expect(projects).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ProjectCode: expect.any(Number),
                  JobNameLong: expect.any(String),
                  PracticeName: expect.any(String),
                  Confidential: expect.any(Boolean),
                  ClientName: expect.any(String),
                }),
              ])
            );
            expect(projects.length).toBe(2);
            projects.forEach((project) => {
              expect(project.ClientName).toBe("Network Rail Limited");
            });
          });
      });
      test("GET: 200 - filter also accepts other properties", () => {
        return request(app)
          .get("/api/projects?PracticeName=Building Engineering")
          .expect(200)
          .then(({ body: { projects } }) => {
            expect(projects).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ProjectCode: expect.any(Number),
                  JobNameLong: expect.any(String),
                  PracticeName: expect.any(String),
                  Confidential: expect.any(Boolean),
                  ClientName: expect.any(String),
                }),
              ])
            );
            expect(projects.length).toBe(31);
            projects.forEach((project) => {
              expect(project.PracticeName).toBe("Building Engineering");
            });
          });
      });
      test("GET: 200 - filter works with multiple properties", () => {
        return request(app)
          .get(
            "/api/projects?PracticeName=Building Engineering&ClientName=Muse Developments Ltd"
          )
          .expect(200)
          .then(({ body: { projects } }) => {
            expect(projects).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  ProjectCode: expect.any(Number),
                  JobNameLong: expect.any(String),
                  PracticeName: expect.any(String),
                  Confidential: expect.any(Boolean),
                  ClientName: expect.any(String),
                }),
              ])
            );
            expect(projects.length).toBe(2);
            projects.forEach((project) => {
              expect(project.PracticeName).toBe("Building Engineering");
              expect(project.ClientName).toBe("Muse Developments Ltd");
            });
          });
      });
      test("GET: 400 - nonsense filter ", () => {
        return request(app)
          .get("/api/projects?Sam=Cool")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request to db!!!");
          });
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "patch", "post", "delete"];
        const endPoint = "/api/projects";
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

      describe("/projects/staff", () => {
        test("POST: 200 - when passed a list of projects, returns a list of staff who have worked on those projects", () => {
          return request(app)
            .post("/api/projects/staff")
            .send({ Projects: [24625900, 22398800, 26766100] })
            .expect(200)
            .then(({ body: { staffList } }) => {
              expect(staffList).toEqual([
                { StaffID: 37704, TotalHrs: 5384.5, ProjectCount: 3 },
                { StaffID: 56876, TotalHrs: 3094.5, ProjectCount: 1 },
              ]);
            });
        });
        test("POST: 200 - accepts queries on staff", () => {
          return request(app)
            .post("/api/projects/staff?GradeLevel=6")
            .send({ Projects: [24625900, 22398800, 26766100] })
            .expect(200)
            .then(({ body: { staffList } }) => {
              expect(staffList).toEqual([
                { StaffID: 37704, TotalHrs: 5384.5, ProjectCount: 3 },
              ]);
            });
        });
        test("POST: 200 - works with other filters", () => {
          return request(app)
            .post("/api/projects/staff?LocationName=Manchester Office")
            .send({ Projects: [24625900, 22398800, 26766100, 24675700] })
            .expect(200)
            .then(({ body: { staffList } }) => {
              expect(staffList).toEqual([
                { StaffID: 37704, TotalHrs: 5393.25, ProjectCount: 4 },
                { StaffID: 56876, TotalHrs: 4318.25, ProjectCount: 2 },
              ]);
            });
        });
        test("POST: 400 - no projects provided", () => {
          return request(app)
            .post("/api/projects/staff")
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No projects provided!!!");
            });
        });
        test("POST: 400 - bad project ID provided", () => {
          return request(app)
            .post("/api/projects/staff")
            .send({ Projects: ["samstyles", 24625900] })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "get", "delete"];
          const endPoint = "/api/projects/staff";
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
                    StaffID: expect.any(Number),
                    TotalHrs: expect.any(Number),
                    experience: null,
                    experienceID: expect.any(Number),
                  }),
                ])
              );
              projects.forEach((project) => {
                expect(project.StaffID).toBe(37704);
              });
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
                    StaffID: expect.any(Number),
                    TotalHrs: expect.any(Number),
                    experience: null,
                    experienceID: expect.any(Number),
                    JobNameLong: expect.any(String),
                    ClientName: expect.any(String),
                  }),
                ])
              );
              expect(projects.length).toBe(17);
              projects.forEach((project) => {
                expect(project.StaffID).toBe(37704);
              });
            });
        });
        test("GET: 200 - list can be filtered ", () => {
          //note: show details will be set to true if filters are used since most of the filter categories are in the detailed part)
          return request(app)
            .get("/api/projects/staff/37704?ClientName=Muse Developments Ltd")
            .expect(200)
            .then(({ body: { projects } }) => {
              expect(projects).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    ProjectCode: expect.any(Number),
                    StaffID: expect.any(Number),
                    TotalHrs: expect.any(Number),
                    experience: null,
                    experienceID: expect.any(Number),
                    JobNameLong: expect.any(String),
                    ClientName: expect.any(String),
                  }),
                ])
              );
              projects.forEach((project) => {
                expect(project.StaffID).toBe(37704);
                expect(project.ClientName).toBe("Muse Developments Ltd");
              });
              expect(projects.length).toBe(2);
            });
        });
        test("GET: 200 - works with other filters ", () => {
          return request(app)
            .get("/api/projects/staff/56876?BusinessCode=BC14")
            .expect(200)
            .then(({ body: { projects } }) => {
              expect(projects).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    ProjectCode: expect.any(Number),
                    StaffID: expect.any(Number),
                    TotalHrs: expect.any(Number),
                    experience: null,
                    experienceID: expect.any(Number),
                    JobNameLong: expect.any(String),
                    ClientName: expect.any(String),
                  }),
                ])
              );
              projects.forEach((project) => {
                expect(project.StaffID).toBe(56876);
                expect(project.BusinessCode).toBe("BC14");
              });
              expect(projects.length).toBe(3);
            });
        });
        test("GET: 200 - filters work with show details ", () => {
          return request(app)
            .get(
              "/api/projects/staff/37704?ClientName=Muse Developments Ltd&showDetails=false"
            )
            .expect(200)
            .then(({ body: { projects } }) => {
              expect(projects).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    ProjectCode: expect.any(Number),
                    StaffID: expect.any(Number),
                    TotalHrs: expect.any(Number),
                    experience: null,
                    experienceID: expect.any(Number),
                    JobNameLong: expect.any(String),
                    ClientName: expect.any(String),
                  }),
                ])
              );
              projects.forEach((project) => {
                expect(project.StaffID).toBe(37704);
                expect(project.ClientName).toBe("Muse Developments Ltd");
              });
              expect(projects.length).toBe(2);
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
        test("GET: 400 - nonsense filter ", () => {
          return request(app)
            .get("/api/projects/staff/37704?Sam=Cool")
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

      describe("/projects/keywords/:StaffID", () => {
        test("GET: 200 - get keywords for staff projects", () => {
          return request(app)
            .get(
              "/api/projects/keywords/37704?ClientName=Muse Developments Ltd"
            )
            .expect(200)
            .then(({ body: { keywords } }) => {
              expect(keywords).toEqual([
                "AP0054",
                "AP9900",
                "BC0001",
                "BC0004",
                "BC0016",
                "BP9900",
                "CT0010",
                "CT0035",
                "CT9900",
                "DI0001",
                "DI0004",
                "DI0005",
                "DI0006",
                "DI0007",
                "DI0008",
                "DI0010",
                "DI0016",
                "DI0040",
                "DI0054",
                "DI0055",
                "DI0056",
                "DI0058",
                "DI0070",
                "DI0079",
                "DI0080",
                "DI9900",
                "IP0001",
                "MA0005",
                "MA0031",
                "MA9900",
                "MI0048",
                "MI0052",
                "MI0069",
                "MI0135",
                "MI0191",
                "MI0205",
                "MI0209",
                "MI0239",
                "MI0255",
                "MI0279",
                "MI0282",
                "MI0285",
                "MI0289",
                "MI0292",
                "MI0310",
                "MI0311",
                "MI0313",
                "MI0334",
                "MI0345",
                "MI0348",
                "MI0418",
                "MI0419",
                "MI0451",
                "MI0557",
                "MI0563",
                "MI0577",
                "MI0956",
                "MI9001",
                "MI9002",
                "MI9900",
                "MS0014",
                "MS0022",
                "MS9900",
                "MT0127",
                "MT0260",
                "MT0289",
                "MT0298",
                "MT0313",
                "MT0364",
                "MT9900",
                "MW0019",
                "MW0026",
                "MW0032",
                "MW9900",
                "PS0021",
                "PS0029",
                "PS0039",
                "PS0054",
                "PS5001",
                "PS9900",
              ]);
              expect(keywords.length).toBe(80);
            });
        });
        test("GET: 404 - staffmember doesn't exist in the database", () => {
          const apiString = `/api/projects/keywords/99999`;
          return request(app)
            .get(apiString)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("GET: 400 - bad StaffID", () => {
          return request(app)
            .get("/api/projects/keywords/samstyles")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "post", "delete"];
          const endPoint = "/api/projects/keywords/37704";
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
                ScopeOfWorks: [
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                ],
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: true,
                imgURL: [],
                Keywords: [
                  "AP0054",
                  "AP9900",
                  "BC0001",
                  "BC0004",
                  "BP9900",
                  "CT0010",
                  "CT9900",
                  "DI0001",
                  "DI0004",
                  "DI0007",
                  "DI0008",
                  "DI0010",
                  "DI0056",
                  "DI0058",
                  "DI0070",
                  "DI0079",
                  "DI9900",
                  "IP0001",
                  "MA0005",
                  "MA9900",
                  "MI0052",
                  "MI0135",
                  "MI0205",
                  "MI0209",
                  "MI0285",
                  "MI0289",
                  "MI0292",
                  "MI0310",
                  "MI0311",
                  "MI0334",
                  "MI0348",
                  "MI0418",
                  "MI0419",
                  "MI0577",
                  "MI0956",
                  "MI9900",
                  "MS0022",
                  "MS9900",
                  "MT0298",
                  "MT9900",
                  "MW0019",
                  "MW0032",
                  "MW9900",
                  "PS0039",
                  "PS0054",
                  "PS5001",
                  "PS9900",
                ],
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
                ScopeOfWorks: [
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                ],
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: true,
                imgURL: [],
                StaffID: 37704,
                TotalHrs: 3730.75,
                experience: null,
                experienceID: expect.any(Number),
                Keywords: [
                  "AP0054",
                  "AP9900",
                  "BC0001",
                  "BC0004",
                  "BP9900",
                  "CT0010",
                  "CT9900",
                  "DI0001",
                  "DI0004",
                  "DI0007",
                  "DI0008",
                  "DI0010",
                  "DI0056",
                  "DI0058",
                  "DI0070",
                  "DI0079",
                  "DI9900",
                  "IP0001",
                  "MA0005",
                  "MA9900",
                  "MI0052",
                  "MI0135",
                  "MI0205",
                  "MI0209",
                  "MI0285",
                  "MI0289",
                  "MI0292",
                  "MI0310",
                  "MI0311",
                  "MI0334",
                  "MI0348",
                  "MI0418",
                  "MI0419",
                  "MI0577",
                  "MI0956",
                  "MI9900",
                  "MS0022",
                  "MS9900",
                  "MT0298",
                  "MT9900",
                  "MW0019",
                  "MW0032",
                  "MW9900",
                  "PS0039",
                  "PS0054",
                  "PS5001",
                  "PS9900",
                ],
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
        test("GET: 400 - bad ProjectCode", () => {
          return request(app)
            .get("/api/project/WBSQ?StaffID=37704")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("GET: 404 - ProjectCode doesn't exist in the database", () => {
          return request(app)
            .get("/api/project/9999999?StaffID=37704")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("ProjectCode not found");
            });
        });
        test("PATCH: 200 - amend project details by project code", () => {
          return request(app)
            .patch("/api/project/22398800")
            .send({
              JobNameLong: "Warrington Time Square",
              ScopeOfService: "Multi-disciplinary appointment.",
              Confidential: false,
            })
            .expect(200)
            .then(({ body: { project } }) => {
              expect(project).toEqual({
                ProjectCode: 22398800,
                JobNameLong: "WARRINGTON TIME SQUARE",
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
                ScopeOfService: "Multi-disciplinary appointment.",
                ScopeOfWorks: [
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                ],
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: false,
                imgURL: [],
                Keywords: [
                  "AP0054",
                  "AP9900",
                  "BC0001",
                  "BC0004",
                  "BP9900",
                  "CT0010",
                  "CT9900",
                  "DI0001",
                  "DI0004",
                  "DI0007",
                  "DI0008",
                  "DI0010",
                  "DI0056",
                  "DI0058",
                  "DI0070",
                  "DI0079",
                  "DI9900",
                  "IP0001",
                  "MA0005",
                  "MA9900",
                  "MI0052",
                  "MI0135",
                  "MI0205",
                  "MI0209",
                  "MI0285",
                  "MI0289",
                  "MI0292",
                  "MI0310",
                  "MI0311",
                  "MI0334",
                  "MI0348",
                  "MI0418",
                  "MI0419",
                  "MI0577",
                  "MI0956",
                  "MI9900",
                  "MS0022",
                  "MS9900",
                  "MT0298",
                  "MT9900",
                  "MW0019",
                  "MW0032",
                  "MW9900",
                  "PS0039",
                  "PS0054",
                  "PS5001",
                  "PS9900",
                ],
              });
            });
        });
        test.only("PATCH: 200 - amending also works on ScopeOfWorks array", () => {
          return request(app)
            .patch("/api/project/22398800")
            .send({
              JobNameLong: "Warrington Time Square",
              ScopeOfService: "Multi-disciplinary appointment.",
              Confidential: false,
              ScopeOfWorks: [
                "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                "Great new scope of works",
              ],
            })
            .expect(200)
            .then(({ body: { project } }) => {
              expect(project).toEqual({
                ProjectCode: 22398800,
                JobNameLong: "WARRINGTON TIME SQUARE",
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
                ScopeOfService: "Multi-disciplinary appointment.",
                ScopeOfWorks: [
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                  "Great new scope of works",
                ],
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: false,
                imgURL: [],
                Keywords: [
                  "AP0054",
                  "AP9900",
                  "BC0001",
                  "BC0004",
                  "BP9900",
                  "CT0010",
                  "CT9900",
                  "DI0001",
                  "DI0004",
                  "DI0007",
                  "DI0008",
                  "DI0010",
                  "DI0056",
                  "DI0058",
                  "DI0070",
                  "DI0079",
                  "DI9900",
                  "IP0001",
                  "MA0005",
                  "MA9900",
                  "MI0052",
                  "MI0135",
                  "MI0205",
                  "MI0209",
                  "MI0285",
                  "MI0289",
                  "MI0292",
                  "MI0310",
                  "MI0311",
                  "MI0334",
                  "MI0348",
                  "MI0418",
                  "MI0419",
                  "MI0577",
                  "MI0956",
                  "MI9900",
                  "MS0022",
                  "MS9900",
                  "MT0298",
                  "MT9900",
                  "MW0019",
                  "MW0032",
                  "MW9900",
                  "PS0039",
                  "PS0054",
                  "PS5001",
                  "PS9900",
                ],
              });
            });
        });
        test.only("PATCH: 200 - requests to patch imgURL and keywords are ignored", () => {
          return request(app)
            .patch("/api/project/22398800")
            .send({
              JobNameLong: "Warrington Time Square",
              ScopeOfService: "Multi-disciplinary appointment.",
              Confidential: false,
              imgURL: "www.newimage,com",
              ScopeOfWorks: [
                "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                "Great new scope of works",
              ],
              Keywords: "ZZZ001",
            })
            .expect(200)
            .then(({ body: { project } }) => {
              expect(project).toEqual({
                ProjectCode: 22398800,
                JobNameLong: "WARRINGTON TIME SQUARE",
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
                ScopeOfService: "Multi-disciplinary appointment.",
                ScopeOfWorks: [
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                  "Great new scope of works",
                ],
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: false,
                imgURL: [],
                Keywords: [
                  "AP0054",
                  "AP9900",
                  "BC0001",
                  "BC0004",
                  "BP9900",
                  "CT0010",
                  "CT9900",
                  "DI0001",
                  "DI0004",
                  "DI0007",
                  "DI0008",
                  "DI0010",
                  "DI0056",
                  "DI0058",
                  "DI0070",
                  "DI0079",
                  "DI9900",
                  "IP0001",
                  "MA0005",
                  "MA9900",
                  "MI0052",
                  "MI0135",
                  "MI0205",
                  "MI0209",
                  "MI0285",
                  "MI0289",
                  "MI0292",
                  "MI0310",
                  "MI0311",
                  "MI0334",
                  "MI0348",
                  "MI0418",
                  "MI0419",
                  "MI0577",
                  "MI0956",
                  "MI9900",
                  "MS0022",
                  "MS9900",
                  "MT0298",
                  "MT9900",
                  "MW0019",
                  "MW0032",
                  "MW9900",
                  "PS0039",
                  "PS0054",
                  "PS5001",
                  "PS9900",
                ],
              });
            });
        });
        test("PATCH: 404 - ProjectCode doesn't exist in the database", () => {
          return request(app)
            .patch("/api/project/9999999")
            .send({
              JobNameLong: "Warrington Time Square",
              ScopeOfService: "Multi-disciplinary appointment.",
              Confidential: false,
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("ProjectCode not found");
            });
        });
        test("PATCH: 400 - bad ProjectCode", () => {
          return request(app)
            .patch("/api/project/wbsq")
            .send({
              JobNameLong: "Warrington Time Square",
              ScopeOfService: "Multi-disciplinary appointment.",
              Confidential: false,
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("PATCH: 400 - non-existent attribute", () => {
          return request(app)
            .patch("/api/project/25397800")
            .send({
              newPic: "www.samstyles.com",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        // test("POST: 200 - add Projectimage and update imgURL (if it is new)", () => { //tested using insomnia });
        test("POST: 400 - cannot be used to post anything other than a file", () => {
          return request(app)
            .post("/api/project/22398800")
            .send({ nationality: "British" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("no files provided");
            });
        });
        // test("POST: 404 - file rejected by cloudinary", () => { //tested using insomnia });
        // test("POST: 400 - bad ProjectCode", () => { //tested using insomnia });
        // test("DELETE: 204 - removes image from Cloudinary", () => {//tested using Insomnia});
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put"];
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
      });

      describe("/project/keywords/:ProjectCode", () => {
        test("GET: 200 - get keywords for a project", () => {
          return request(app)
            .get("/api/project/keywords/22398800")
            .expect(200)
            .then(({ body: { keywords } }) => {
              expect(keywords).toEqual([
                "AP0054",
                "AP9900",
                "BC0001",
                "BC0004",
                "BP9900",
                "CT0010",
                "CT9900",
                "DI0001",
                "DI0004",
                "DI0007",
                "DI0008",
                "DI0010",
                "DI0056",
                "DI0058",
                "DI0070",
                "DI0079",
                "DI9900",
                "IP0001",
                "MA0005",
                "MA9900",
                "MI0052",
                "MI0135",
                "MI0205",
                "MI0209",
                "MI0285",
                "MI0289",
                "MI0292",
                "MI0310",
                "MI0311",
                "MI0334",
                "MI0348",
                "MI0418",
                "MI0419",
                "MI0577",
                "MI0956",
                "MI9900",
                "MS0022",
                "MS9900",
                "MT0298",
                "MT9900",
                "MW0019",
                "MW0032",
                "MW9900",
                "PS0039",
                "PS0054",
                "PS5001",
                "PS9900",
              ]);
              expect(keywords.length).toBe(47);
            });
        });
        test("GET: 400 - bad ProjectCode", () => {
          return request(app)
            .get("/api/project/keywords/WBSQ")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("GET: 404 - ProjectCode doesn't exist in the database", () => {
          return request(app)
            .get("/api/project/keywords/9999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("ProjectCode not found");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "post", "delete"];
          const endPoint = "/api/project/keywords/25397800";
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

      describe("/project/staff/:ProjectCode", () => {
        test("PATCH: 200 - add staff experience to project", () => {
          return request(app)
            .patch("/api/project/staff/22398800?StaffID=37704")
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
                ScopeOfWorks: [
                  "Mixed use development in central Warrington, for the Bridge Street Quarter.",
                ],
                Latitude: 53.39,
                Longitude: -2.6,
                State: "CHESHIRE",
                PercentComplete: 100,
                ClientID: 11276,
                ClientName: "Muse Developments Ltd",
                ProjectURL:
                  "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
                Confidential: true,
                imgURL: [],
                StaffID: 37704,
                TotalHrs: 3730.75,
                experience: "Sam worked really hard on this project.",
                experienceID: expect.any(Number),
                Keywords: [
                  "AP0054",
                  "AP9900",
                  "BC0001",
                  "BC0004",
                  "BP9900",
                  "CT0010",
                  "CT9900",
                  "DI0001",
                  "DI0004",
                  "DI0007",
                  "DI0008",
                  "DI0010",
                  "DI0056",
                  "DI0058",
                  "DI0070",
                  "DI0079",
                  "DI9900",
                  "IP0001",
                  "MA0005",
                  "MA9900",
                  "MI0052",
                  "MI0135",
                  "MI0205",
                  "MI0209",
                  "MI0285",
                  "MI0289",
                  "MI0292",
                  "MI0310",
                  "MI0311",
                  "MI0334",
                  "MI0348",
                  "MI0418",
                  "MI0419",
                  "MI0577",
                  "MI0956",
                  "MI9900",
                  "MS0022",
                  "MS9900",
                  "MT0298",
                  "MT9900",
                  "MW0019",
                  "MW0032",
                  "MW9900",
                  "PS0039",
                  "PS0054",
                  "PS5001",
                  "PS9900",
                ],
              });
            });
        });
        test("PATCH: 404 - no staff_id provided", () => {
          return request(app)
            .patch("/api/project/staff/25397800")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No staff id provided!!!");
            });
        });
        test("PATCH: 404 - cannot patch staff experience if no time row exists", () => {
          return request(app)
            .patch("/api/project/staff/25397800?StaffID=37704")
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
            .patch("/api/project/staff/25397800?StaffID=99999")
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
            .patch("/api/project/staff/25397800?StaffID=samstyles")
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
            .patch("/api/project/staff/25397800?StaffID=37704")
            .send({
              newPic: "www.samstyles.com",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("PATCH: 404 - ProjectCode doesn't exist in the database", () => {
          return request(app)
            .patch("/api/project/staff/9999999?StaffID=37704")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("ProjectCode not found");
            });
        });
        test("PATCH: 404 - bad ProjectCode", () => {
          return request(app)
            .patch("/api/project/staff/999999?StaffID=37704")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("ProjectCode not found");
            });
        });
        test("POST: 201 - adds staff experience  if no time row exists", () => {
          return request(app)
            .post("/api/project/staff/25397800?StaffID=37704")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(200)
            .then(({ body: { experience } }) => {
              expect(experience).toEqual({
                TotalHrs: 5,
                experience: "Sam worked really hard on this project.",
                experienceID: expect.any(Number),
                ProjectCode: 25397800,
                StaffID: 37704,
              });
            });
        });
        test("POST: 404 - no staff_id provided", () => {
          return request(app)
            .post("/api/project/staff/25397800")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No staff id provided!!!");
            });
        });
        test("POST: 400 - bad StaffID", () => {
          return request(app)
            .post("/api/project/staff/25397800?StaffID=samstyles")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("POST: 404 - staffmember doesn't exist in the database", () => {
          return request(app)
            .post("/api/project/staff/25397800?StaffID=99999")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("StaffID not found");
            });
        });
        test("POST: 404 - experience or TotalHrs missing", () => {
          return request(app)
            .post("/api/project/staff/25397800?StaffID=37704")
            .send({
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Missing attributes!!!");
            });
        });
        test("POST: 404 - ProjectCode doesn't exist in the database", () => {
          return request(app)
            .post("/api/project/staff/9999999?StaffID=37704")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("ProjectCode not found");
            });
        });
        test("POST: 404 - bad ProjectCode", () => {
          return request(app)
            .post("/api/project/staff/999999?StaffID=37704")
            .send({
              TotalHrs: 5,
              experience: "Sam worked really hard on this project.",
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("ProjectCode not found");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["get", "put", "delete"];
          const endPoint = "/api/project/staff/25397800";
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

    describe("/keywords", () => {
      test("GET: 200 - returns list of keywords, ", () => {
        return request(app)
          .get("/api/keywords")
          .expect(200)
          .then(({ body: { keywords } }) => {
            expect(keywords).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  KeywordCode: expect.any(String),
                  Keyword: expect.any(String),
                  KeywordGroupCode: expect.any(String),
                }),
              ])
            );
          });
      });
      test("GET: 200 - returns list of keywords, can be filtered by group ", () => {
        return request(app)
          .get("/api/keywords?KeywordGroupCode=AE")
          .expect(200)
          .then(({ body: { keywords } }) => {
            expect(keywords).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  KeywordCode: expect.any(String),
                  Keyword: expect.any(String),
                  KeywordGroupCode: expect.any(String),
                }),
              ])
            );
            keywords.forEach((keyword) => {
              expect(keyword.KeywordGroupCode).toBe("AE");
            });
          });
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "delete", "patch", "post"];
        const endPoint = "/api/keywords";
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

      describe("/keywords/groups", () => {
        test("GET: 200 - returns list of keyword groups", () => {
          return request(app)
            .get("/api/keywords/groups")
            .expect(200)
            .then(({ body: { keywordGroups } }) => {
              expect(keywordGroups).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    KeywordGroupCode: expect.any(String),
                    KeywordGroupName: expect.any(String),
                  }),
                ])
              );
              expect(keywordGroups.length).toBe(30);
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "patch", "post", "delete"];
          const endPoint = "/api/keywords/groups";
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
});
