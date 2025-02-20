if (!self.define) {
  let e,
    n = {};
  const s = (s, i) => (
    (s = new URL(s + ".js", i).href),
    n[s] ||
      new Promise((n) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = n), document.head.appendChild(e);
        } else (e = s), importScripts(s), n();
      }).then(() => {
        let e = n[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, t) => {
    const a =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (n[a]) return;
    let r = {};
    const c = (e) => s(e, a),
      l = { module: { uri: a }, exports: r, require: c };
    n[a] = Promise.all(i.map((e) => l[e] || c(e))).then((e) => (t(...e), r));
  };
}
define(["./workbox-922eac4d"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "eec1f621051d45d106e14629d152807f",
        },
        {
          url: "/_next/server/app/_not-found/page_client-reference-manifest.js",
          revision: "44757de973e38ec3a4b4b8aa450bb75e",
        },
        {
          url: "/_next/server/app/general-projects/page_client-reference-manifest.js",
          revision: "82344c992816c0b088fecf00178163c8",
        },
        {
          url: "/_next/server/app/new-tasks/[projectId]/page_client-reference-manifest.js",
          revision: "fff34845f5f264123877e0df51598f64",
        },
        {
          url: "/_next/server/app/page_client-reference-manifest.js",
          revision: "d4dcafe31057a1c646ba65ffe30baead",
        },
        {
          url: "/_next/server/app/project/[projectId]/page_client-reference-manifest.js",
          revision: "36d04de4e10fb37182b2d1e50b062249",
        },
        {
          url: "/_next/server/app/sign-in/[[...sign-in]]/page_client-reference-manifest.js",
          revision: "6b9cdb1081ab8d55bab60ad8b5d6a667",
        },
        {
          url: "/_next/server/app/sign-up/[[...sign-up]]/page_client-reference-manifest.js",
          revision: "758ac67629a939e1913af7f47478355a",
        },
        {
          url: "/_next/server/app/task-details/[taskId]/page_client-reference-manifest.js",
          revision: "36417e776cd6dbbbbdb4793278a07d71",
        },
        {
          url: "/_next/server/middleware-build-manifest.js",
          revision: "a7bea4dd1c76d4239fd8383cb4a03c99",
        },
        {
          url: "/_next/server/middleware-react-loadable-manifest.js",
          revision: "38c141691c3d2b1dfbe74a853014cae9",
        },
        {
          url: "/_next/server/next-font-manifest.js",
          revision: "9fce7989bff5d35b01e177447faca50d",
        },
        {
          url: "/_next/server/next-font-manifest.json",
          revision: "d51420cd4aa5d37d6719849cf36d0d6f",
        },
        {
          url: "/_next/static/CkFKnaEdygGVdh2k0SxUw/_buildManifest.js",
          revision: "dc3e9a417c812850b9ad6bab86a2301f",
        },
        {
          url: "/_next/static/CkFKnaEdygGVdh2k0SxUw/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/_next/static/chunks/196-8530545e2da9e901.js", revision: null },
        { url: "/_next/static/chunks/203.2b4c1ee4fbe3a7cf.js", revision: null },
        { url: "/_next/static/chunks/218.57a830a2c55ba802.js", revision: null },
        { url: "/_next/static/chunks/355.598b38a18fa29b80.js", revision: null },
        { url: "/_next/static/chunks/37-e0b4c8621289892a.js", revision: null },
        { url: "/_next/static/chunks/387-8ae6be8db2766db2.js", revision: null },
        {
          url: "/_next/static/chunks/4bd1b696-41de3feeb740bf22.js",
          revision: null,
        },
        { url: "/_next/static/chunks/517-1910bb6b2e2baffc.js", revision: null },
        { url: "/_next/static/chunks/519-d58ac7b1e316929b.js", revision: null },
        { url: "/_next/static/chunks/705-884922008369d30a.js", revision: null },
        { url: "/_next/static/chunks/795-04707648de0ba715.js", revision: null },
        { url: "/_next/static/chunks/809.6f229c229e72a61d.js", revision: null },
        {
          url: "/_next/static/chunks/app/_not-found/page-4e8d7b9083846ccb.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/general-projects/page-6bf64c4054f4d677.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/layout-d3e339a2e214bec3.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/new-tasks/[projectId]/page-23e567670d26bf5a.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/not-found-24833a65694b7ff1.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/page-428480bac768cc0c.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/project/[projectId]/page-078721ff7dd46f7a.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/sign-in/[[...sign-in]]/page-01e9a65119bfca9a.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/sign-up/[[...sign-up]]/page-d25cbcb56c1dd2d0.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/app/task-details/[taskId]/page-c59a029306c06d30.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/framework-6b27c2b7aa38af2d.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/main-app-83f99ef94de747f8.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/main-e573edb3ef68b2b2.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/pages/_app-430fec730128923e.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/pages/_error-2d7241423c4a35ba.js",
          revision: null,
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-ac521c461d81eaf9.js",
          revision: null,
        },
        { url: "/_next/static/css/5ffc76fbbe15378a.css", revision: null },
        { url: "/_next/static/css/941a982db7f306b1.css", revision: null },
        { url: "/_next/static/css/e7eddfe4828c1690.css", revision: null },
      ],
      {}
    ),
    e.cleanupOutdatedCaches();
});
