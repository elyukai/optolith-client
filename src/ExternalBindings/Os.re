[@bs.module "os"]
external platform:
  unit =>
  [
    | `aix
    | `android
    | `darwin
    | `freebsd
    | `linux
    | `openbsd
    | `sunos
    | `win32
    | `cygwin
    | `netbsd
  ] =
  "platform";
