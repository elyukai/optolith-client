open Webapi.Dom;
open Ley.Option.Functor;

let modalRoot = Document.querySelector("#modals-root", document);

let%private eventTargetToDom =
            (x: Js.t({..})): Dom.eventTarget_like(Dom._node('a)) =>
  Obj.magic(x);

[@react.component]
let make = (~baseClassName, ~className=?, ~children, ~isOpen, ~onBackdrop) => {
  let element = React.useMemo(() => Document.createElement("div", document));

  let backdropRef = React.useRef(Js.Nullable.null);

  React.useEffect1(
    () =>
      modalRoot
      <&> (
        rootElement => {
          Element.appendChild(element, rootElement);

          () => ignore(Element.removeChild(element, rootElement));
        }
      ),
    [|element|],
  );

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

  ReactDOMRe.createPortal(
    isOpen
      ? <div
          className={ClassNames.fold([
            Ley.Option.Monad.return(baseClassName ++ "-backdrop"),
            className,
          ])}
          onClick=handleBackdropClick
          ref={ReactDOMRe.Ref.domRef(backdropRef)}>
          <article className=baseClassName> children </article>
        </div>
      : React.null,
    element,
  );
};
