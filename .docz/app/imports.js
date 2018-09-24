export const imports = {
  "faq.mdx": () =>
    import(/* webpackPrefetch: true, webpackChunkName: "faq" */ "faq.mdx")
};
