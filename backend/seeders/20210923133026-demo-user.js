"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        id: 1,
        email: "admin@groupomania.com",
        firstname: "Don",
        lastname: "Corleone",
        password: "$2b$05$atF3BDlUmb06t10VuNEYfeqmeGiRtpVd7VRyOHprMu0ka8YlTr8D.",
        bio: "I'am the AdminFather !",
        avatar: "/static/media/4.a9833454.jpg",
        isAdmin: 1,
        createdAt: "2021-09-23 12:34:42",
        updatedAt: "2021-09-23 12:36:05",
      },
      {
        id: 2,
        email: "john.wick@groupomania.com",
        firstname: "John",
        lastname: "Wick",
        password: "$2b$05$Kw/OvPBbCm1f2vExU9P1rOsM21jvjVFINagndNnxhREHSFz.AIOcu",
        bio: "Il ne fallait pas toucher à mon chien ...",
        avatar: "/static/media/5.08701804.jpg",
        isAdmin: 0,
        createdAt: "2021-09-23 12:48:02",
        updatedAt: "2021-09-23 12:48:41",
      },
      {
        id: 3,
        email: "wonder.woman@groupomania.com",
        firstname: "Wonder",
        lastname: "Woman",
        password: "$2b$05$wpTbnV3Cl3Rl1j2oqEZ6z.IZfBaXvH.facCMKXHJ9VIrCjOlq0V9.",
        bio: "Il n'y a pas que les hommes qui savent se battre !",
        avatar: "/static/media/7.65fd009b.jpg",
        isAdmin: 0,
        createdAt: "2021-09-23 12:53:52",
        updatedAt: "2021-09-23 12:54:26",
      },
      {
        id: 4,
        email: "dark.vador@groupomania.com",
        firstname: "Dark",
        lastname: "Vador",
        password: "$2b$05$PYrmI.pwzpbMKQWTIPVtseyGqxTTCcx8dMw9BsyXNoZSC6E1lX9K2",
        bio: "Je suis l'empereur galactique !",
        avatar: "/static/media/9.4fabbe46.jpg",
        isAdmin: 0,
        createdAt: "2021-09-23 13:00:34",
        updatedAt: "2021-09-23 13:01:07",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
