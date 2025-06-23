// import type { AppIcon } from "@/src/types/desktop"
// import { create } from "zustand"
// import { devtools, persist } from 'zustand/middleware'

// interface DesktopStore {
//   apps: AppIcon[]
//   setApps: (app: AppIcon) => void
// }

// const useDesktopStore = create<DesktopStore>()(
//   devtools(
//     immer((set) => ({
//       apps: [],
//       addApp: (app: AppIcon) =>
//         set((state) => {
//           state.apps.push(app); // immerを使用して直接状態を更新
//         }),
//     })),
//     {
//       name: "desktop-store", // devtoolsで識別するための名前
//     }
//   )
// );

// // const useDesktopStore = create<DesktopStore>()(
// //   devtools(
// //     immer((set) => ({
// //       apps: []
// //       ,
// //       addApp: (app: AppIcon) =>
// //         set((state) => {
// //           state.apps.push(app)
// //         })
// //     })

// //     ),
// //     {
// //       name: "desktop-store"
// //     }
// //   )
// // )

