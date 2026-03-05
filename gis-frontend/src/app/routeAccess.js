
//koristi se u AppLayout da zabrani pristup ruti iz URL-a, onom ko nema dozvolu
export const routeAccess = [
  { prefix: "/areas", roles: ["USER"] },
  { prefix: "/statistics", roles: ["USER"] },
  { prefix: "/userDashboard", roles: ["USER"] },
  { prefix: "/myProfile", roles: ["USER", "ADMIN"] },


  { prefix: "/adminDashboard", roles: ["ADMIN"] },
];
