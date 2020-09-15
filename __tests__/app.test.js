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
            console.log(projects);
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
            console.log(projects);
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
            console.log(projects);
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
      describe("/projects/staff/:StaffID", () => {
        test("GET: 200 - check staffmember exists and fetch project list for an individual", () => {
          return request(app)
            .get("/api/projects/staff/37704")
            .expect(200)
            .then(({ body: { projects } }) => {
              console.log(projects);
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
                Confidential: false,
                imageURL: null,
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
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "delete", "post"];
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
  });
});
