export const routes = {
  COMMENTS_LIST: "/comments_list",
  COMMENT: "/comment",
  CREATE_COMMENT: "/comments_create/",
  GET_TOKEN: "/token/",
  REFRESH_TOKEN: "/token/refresh/",
  HOME: "/",
};

export const navigation = [
  {
    name: "Home",
    href: routes.HOME,
  },
  {
    name: "Comments List",
    href: routes.COMMENTS_LIST,
  },
  {
    name: "Create Comment",
    href: routes.CREATE_COMMENT,
  },
];
