open Electron.IpcRenderer

let logError = (. _, msg) => Js.Console.error(msg)

@react.component
let make = () => {
  let (currentProcess, setProcess) = React.useState(() => 0.0)

  React.useEffect(() => {
    let handleProcess = (. _, process) => {
      Js.Console.log(process)
      setProcess(_ => process)
    }

    let handleData = (. _, data) => Js.Console.log(data)

    t
    ->on(#DatabaseDecodeError(logError))
    ->on(#DatabaseProcess(handleProcess))
    ->on(#DatabaseProcessed(handleData))
    ->ignore

    Some(
      () => {
        t
        ->remove_listener(#DatabaseDecodeError(logError))
        ->remove_listener(#DatabaseProcess(handleProcess))
        ->remove_listener(#DatabaseProcessed(handleData))
        ->ignore
      },
    )
  })

  <div> {React.int(Js.Math.floor_int(currentProcess *. 100.0))} {React.string(" %")} </div>
}
