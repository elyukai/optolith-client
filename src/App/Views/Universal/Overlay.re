open Webapi.Dom;
open Ley.Option.Functor;
open ReactUtils;

[@bs.scope "document"] [@bs.val] external body: Dom.element = "body";

[@react.component]
let make = (~baseClassName, ~className=?, ~children, ~isOpen, ~onBackdrop) => {
  let backdropRef = React.useRef(Js.Nullable.null);

  let handleBackdropClick =
    React.useCallback1(
      event => {
        backdropRef.current
        |> Js.Nullable.toOption
        <&> (
          currentRef =>
            currentRef
            |> Element.contains(
                 event |> ReactEvent.Mouse.target |> eventTargetToDom,
               )
            |> (!)
              ? onBackdrop(event) : ()
        )
        |> ignore
      },
      [|onBackdrop|],
    );

  isOpen
    ? ReactDOMRe.createPortal(
        <div
          className={ClassNames.fold([
            Ley.Option.Monad.return(baseClassName ++ "-backdrop"),
            className,
          ])}
          onClick=handleBackdropClick
          ref={ReactDOMRe.Ref.domRef(backdropRef)}>
          <div className=baseClassName role="dialog" ariaModal=true>
            children
          </div>
        </div>,
        body,
      )
    : React.null;
};
