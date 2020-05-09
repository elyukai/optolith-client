module ElectronBuilder = {
  type target;

  module Platform = {
    module WINDOWS = {
      [@bs.module "electron-builder"] [@bs.scope ("Platform", "WINDOWS")]
      external createTarget: unit => target = "createTarget";
    };

    module LINUX = {
      [@bs.module "electron-builder"] [@bs.scope ("Platform", "LINUX")]
      external createTarget: unit => target = "createTarget";
    };

    module MAC = {
      [@bs.module "electron-builder"] [@bs.scope ("Platform", "MAC")]
      external createTarget: unit => target = "createTarget";
    };
  };

  module Config = {
    type directories = {
      buildResources: option(string),
      output: option(string),
      app: option(string),
    };

    type target = {
      target: string,
      arch: option(array(string)),
    };

    type mac = {
      artifactName: option(string),
      category: option(string),
      target: option(string),
      icon: option(string),
      [@bs.as "type"]
      type_: option(string),
      hardenedRuntime: option(bool),
      gatekeeperAssess: option(bool),
    };

    type dmg = {sign: option(bool)};

    type win = {
      artifactName: option(string),
      target: option(array(target)),
      icon: option(string),
    };

    type nsis = {
      perMachine: option(bool),
      deleteAppDataOnUninstall: option(bool),
    };

    type linux = {
      artifactName: option(string),
      category: option(string),
      target: option(array(target)),
      executableName: option(string),
      icon: option(string),
    };

    type publish = {
      provider: string,
      url: string,
      channel: option(string),
      useMultipleRangeRequest: option(bool),
    };

    type t = {
      appId: option(string),
      productName: option(string),
      copyright: option(string),
      directories: option(directories),
      mac: option(mac),
      dmg: option(dmg),
      win: option(win),
      nsis: option(nsis),
      linux: option(linux),
      files: option(array(string)),
      publish: option(publish),
    };
  };

  type options = {
    config: Config.t,
    targets: target,
  };

  [@bs.module "electron-builder"]
  external build: options => Js.Promise.t(list(string)) = "build";
};

// module Publisher = {
//   // require("dotenv").config()
//   // const ftp = require ("basic-ftp")
//   // const Client = require ("ssh2-sftp-client")
//   // const fs = require ("fs")
//   // const path = require ("path")
//   // const semver = require ("semver");

//   type channel =
//     | Stable
//     | Insider;

//   type os =
//     | Windows
//     | OSX
//     | Linux;

//   /**
//    * Needed env variables:
//    * - `HOST`
//    * - `USERNAME`
//    * - `PASSWORD`
//    */
//   let publishToServer = (channel, os) => {
//     let subFolder =
//       switch (os) {
//       | Windows => "win"
//       | Linux => "linux"
//       | OSX => "mac"
//       };

//     let updateYmlName =
//       switch (os) {
//       | Windows => "latest.yml"
//       | Linux => "latest-linux.yml"
//       | OSX => "latest-mac.yml"
//       };

//     let distPath =
//       switch (channel) {
//       | Insider => ["dist", "insider"]
//       | Stable => ["dist"]
//       };

//     let subPathServer =
//       switch (channel) {
//       | Insider => "insider/"
//       | Stable => ""
//       };

//     let serverPath = "./update.optolith.app/" ++ subPathServer ++ subFolder;

//     let regex =
//       switch (channel) {
//       | Insider =>
//         switch (os) {
//         | Windows =>
//           %re
//           "/^OptolithInsiderSetup_(.+)\\.exe$/"
//         | Linux =>
//           %re
//           "/^OptolithInsider_(.+)\\.(?:AppImage|tar\\.gz)$/"
//         | OSX =>
//           %re
//           "/^OptolithInsider_(.+)\\.(?:zip|dmg)$/"
//         }
//       | Stable =>
//         switch (os) {
//         | Windows =>
//           %re
//           "/^OptolithSetup_(.+)\\.exe$/"
//         | Linux =>
//           %re
//           "/^Optolith_(.+)\\.(?:AppImage|tar\\.gz)$/"
//         | OSX =>
//           %re
//           "/^Optolith_(.+)\\.(?:zip|dmg)$/"
//         }
//       };

//     let recreateFileNames =
//       switch (channel) {
//       | Insider =>
//         switch (os) {
//         | Windows => (v => ["OptolithInsiderSetup_" ++ v ++ ".exe"])
//         | Linux => (
//             v => [
//               "OptolithInsider_" ++ v ++ ".AppImage",
//               "OptolithInsider_" ++ v ++ ".tar.gz",
//             ]
//           )
//         | OSX => (
//             v => [
//               "OptolithInsider_" ++ v ++ ".dmg",
//               "OptolithInsider_" ++ v ++ ".zip",
//             ]
//           )
//         }
//       | Stable =>
//         switch (os) {
//         | Windows => (v => ["OptolithSetup_" ++ v ++ ".exe"])
//         | Linux => (
//             v => [
//               "Optolith_" ++ v ++ ".AppImage",
//               "Optolith_" ++ v ++ ".tar.gz",
//             ]
//           )
//         | OSX => (
//             v => ["Optolith_" ++ v ++ ".dmg", "Optolith_" ++ v ++ ".zip"]
//           )
//         }
//       };
//     ();
//     // const allFiles = await fs.promises.readdir (path.join (...distPath))
//     // const allInstallerNames = allFiles .filter (fileName => regex .test (fileName))
//     // const allInstallerVersionsSorted =
//     //   allInstallerNames .map (fileName => regex .exec (fileName) [1])
//     //                     .sort (semver .rcompare)
//     // if (allInstallerVersionsSorted .length < 1) {
//     //   throw new RangeError ("Array of sorted installer versions is empty")
//     // }
//     // const latestFileNames = recreateFileNames (allInstallerVersionsSorted [0])
//     // console.log(`Files to upload: ${[updateYmlName, ...latestFileNames] .join (", ")}`);
//     // // Actual server connection
//     // const client = new Client ()
//     // console.log("Connecting to server...");
//     // await client.connect ({
//     //   host: process.env.HOST,
//     //   port: 22,
//     //   username: process.env.USERNAME,
//     //   password: process.env.PASSWORD
//     // })
//     // console.log(`Server connection established`);
//     // for (const fileName of latestFileNames) {
//     //   console.log(`Uploading ${fileName}`);
//     //   const stream = fs.readFileSync (path.join (...distPath, fileName))
//     //   const fileRes = await client.put (stream, `${serverPath}/${fileName}`)
//     //   console.log(`Upload done: ${fileName} (${fileRes})`);
//     // }
//     // console.log(`Uploading ${updateYmlName}`);
//     // const updateYml = fs.readFileSync (path.join (...distPath, updateYmlName))
//     // const ymlRes = await client.put (updateYml, `${serverPath}/${updateYmlName}`)
//     // console.log(`Upload done: ${updateYmlName} (${ymlRes})`);
//     // await client.end ()
//     // console.log("Closed server connection.");
//   };
// };

// module Stable = {
//   let config: ElectronBuilder.Config.t = {
//     appId: Some("com.lukasobermann.optolith"),
//     productName: Some("Optolith"),
//     copyright:
//       Some(
//         "This product was created under a license. Das Schwarze Auge and its logo as well as Aventuria, Dere, Myranor, Riesland, Tharun and Uthuria and their logos are trademarks of Significant GbR. The title and contents of this book are protected under the copyright laws of the United States of America. No part of this publication may be reproduced, stored in retrieval systems or transmitted, in any form or by any means, whether electronic, mechanical, photocopy, recording, or otherwise, without prior written consent by Ulisses Spiele GmbH, Waldems. This publication includes material that is protected under copyright laws by Ulisses Spiele and/or other authors. Such material is used under the Community Content Agreement for the SCRIPTORIUM AVENTURIS. All other original materials in this work is copyright 2017-present by Lukas Obermann and published under the Community Content Agreement for the SCRIPTORIUM AVENTURIS.",
//       ),
//     directories:
//       Some({buildResources: None, output: Some("dist"), app: None}),
//     files: Some([|"app/**/*"|]),
//     mac:
//       Some({
//         artifactName: Some("Optolith_${version}.${ext}"),
//         category: Some("public.app-category.role-playing-games"),
//         target: Some("default"),
//         icon: Some("app/icon.icns"),
//         type_: Some("distribution"),
//         hardenedRuntime: Some(true),
//         gatekeeperAssess: Some(false),
//       }),
//     dmg: Some({sign: Some(false)}),
//     win:
//       Some({
//         artifactName: Some("OptolithSetup_${version}.${ext}"),
//         target: Some([|{target: "nsis", arch: Some([|"x64", "ia32"|])}|]),
//         icon: Some("app/icon.ico"),
//       }),
//     nsis:
//       Some({perMachine: Some(true), deleteAppDataOnUninstall: Some(false)}),
//     linux:
//       Some({
//         artifactName: Some("Optolith_${version}.${ext}"),
//         category: Some("RolePlaying"),
//         target:
//           Some([|
//             {target: "AppImage", arch: Some([|"x64"|])},
//             {target: "tar.gz", arch: Some([|"x64"|])},
//           |]),
//         executableName: Some("Optolith"),
//         icon: Some("app"),
//       }),
//     publish:
//       Some({
//         provider: "generic",
//         url:
//           Belt.Option.getWithDefault(
//             Js.Dict.get(Node.Process.process##env, "PUBLISH_URL"),
//             "",
//           ),
//         channel: Some("latest"),
//         useMultipleRangeRequest: None,
//       }),
//   };

//   let buildWindows = (): Js.Promise.t(unit) => {
//     Js.log("Building Optolith for Windows...");

//     ElectronBuilder.build({
//       config,
//       targets: ElectronBuilder.Platform.WINDOWS.createTarget(),
//     })
//     |> Js.Promise.then_(x => {
//          Js.log("Optolith Build for Windows successful.");
//          x |> ignore |> Js.Promise.resolve;
//        })
//     |> Js.Promise.then_(_ =>
//          Js.Promise.resolve(Publisher.publishToServer(Stable, Windows))
//        )
//     |> Js.Promise.then_(_ => {
//          Js.log("Optolith Build for Windows deployed.");

//          Js.Promise.resolve();
//        });
//   };

//   let buildLinux = (): Js.Promise.t(unit) => {
//     Js.log("Building Optolith for Linux...");

//     ElectronBuilder.build({
//       config,
//       targets: ElectronBuilder.Platform.LINUX.createTarget(),
//     })
//     |> Js.Promise.then_(x => {
//          Js.log("Optolith Build for Linux successful.");
//          x |> ignore |> Js.Promise.resolve;
//        })
//     |> Js.Promise.then_(_ =>
//          Js.Promise.resolve(Publisher.publishToServer(Stable, Linux))
//        )
//     |> Js.Promise.then_(_ => {
//          Js.log("Optolith Build for Linux deployed.");

//          Js.Promise.resolve();
//        });
//   };

//   let buildMac = (): Js.Promise.t(unit) => {
//     Js.log("Building Optolith for OSX...");

//     ElectronBuilder.build({
//       config,
//       targets: ElectronBuilder.Platform.MAC.createTarget(),
//     })
//     |> Js.Promise.then_(x => {
//          Js.log("Optolith Build for OSX successful.");
//          x |> ignore |> Js.Promise.resolve;
//        })
//     |> Js.Promise.then_(_ =>
//          Js.Promise.resolve(Publisher.publishToServer(Stable, OSX))
//        )
//     |> Js.Promise.then_(_ => {
//          Js.log("Optolith Build for OSX deployed.");

//          Js.Promise.resolve();
//        });
//   };
// };
