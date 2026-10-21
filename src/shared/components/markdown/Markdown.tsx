import {
  checkTableRowsAreSections,
  type InlineMarkdownNode,
  type TableCell,
  type TableColumnStyle,
} from "@elyukai/markdown"
import {
  renderFromString,
  renderInlineFromString,
  type BlockBuilderMap,
  type InlineBuilderMap,
  type ParseInnerNode,
} from "@elyukai/markdown/render/builder"
import { intercalate } from "@elyukai/utils/array/transformations"
import * as React from "react"
import { FC } from "react"

export type Env = {
  outerHeadingLevel?: number
  footnoteLabelSuffix?: string
  attributed?: (attributes: Record<string, string | number | boolean>) => (() => void) | undefined
}

type InlineHTMLBuilderMap<E extends Env = Env> = InlineBuilderMap<
  React.ReactNode,
  [index: string | number | undefined, env: E]
>
export type InlineMarkdownBuilderAdjustments<E extends Env> = Partial<InlineHTMLBuilderMap<E>>

const inlineBuilderMap: InlineHTMLBuilderMap = {
  bold: (node, parseInner, index, env) => (
    <strong key={index}>{node.content.map((content, i) => parseInner(content, i, env))}</strong>
  ),
  italic: (node, parseInner, index, env) => (
    <em key={index}>{node.content.map((content, i) => parseInner(content, i, env))}</em>
  ),
  code: (node, _parseInner, index) => <code key={index}>{node.content}</code>,
  link: (node, parseInner, index, env) => (
    <a key={index} href={node.href}>
      {node.content.map((content, i) => parseInner(content, i, env))}
    </a>
  ),
  attributed: (node, parseInner, index, env) => {
    const onClick = env.attributed?.(node.attributes)
    const Tag = onClick === undefined ? "span" : "a"
    return (
      <Tag
        key={index}
        className={`attributed${onClick === undefined ? "" : " attributed--interactive"}`}
        {...Object.fromEntries(Object.entries(node.attributes).map(([k, v]) => [`data-${k}`, v]))}
        onClick={onClick}
      >
        {node.content.map((content, i) => parseInner(content, i, env))}
      </Tag>
    )
  },
  text: node => node.content,
  superscript: (node, parseInner, index, env) => (
    <sup key={index}>{node.content.map((content, i) => parseInner(content, i, env))}</sup>
  ),
  footnoteRef: (node, _parseInner, index) => (
    <sup
      key={index}
      className={`footnote-ref${typeof node.label === "number" ? " footnote-ref--numeric" : ""}`}
      style={
        {
          "--label": node.label.toString(),
        } as React.CSSProperties
      }
      data-reference={node.label.toString()}
    >
      {node.label.toString()}
    </sup>
  ),
}

export const InlineMarkdown: FC<{ source: string; env: Env }> = ({ source, env }) => (
  <>{renderInlineFromString(source, inlineBuilderMap, { builderArgs: [undefined, env] })}</>
)

const TableCell: FC<{
  cellType: "td" | "th"
  cell: TableCell
  cellCount: number
  column: TableColumnStyle | undefined
  parseInnerInline: ParseInnerNode<
    React.ReactNode,
    InlineMarkdownNode,
    [index: string | number | undefined, env: Env]
  >
  env: Env
}> = ({ cellType, cell, cellCount, column, parseInnerInline, env }) => {
  const Cell = cellType
  return (
    <Cell
      colSpan={cell.colSpan}
      scope={cellType === "th" && cellCount === 1 ? "colgroup" : undefined}
      style={{ textAlign: column?.alignment }}
    >
      {cell.content.map((content, i) => parseInnerInline(content, i, env))}
    </Cell>
  )
}

const TableRow: FC<{
  parseInnerInline: ParseInnerNode<
    React.ReactNode,
    InlineMarkdownNode,
    [index: string | number | undefined, env: Env]
  >
  env: Env
  columns: TableColumnStyle[]
  cells: TableCell[]
  cellType: "td" | "th"
}> = (props): React.ReactNode => {
  const { columns, cells, ...other } = props
  return (
    <tr>
      {
        cells.reduce<[elements: React.ReactNode[], columnIndex: number]>(
          ([elements, columnIndex], tc) => [
            [
              ...elements,
              <TableCell
                {...other}
                key={columnIndex}
                cell={tc}
                cellCount={cells.length}
                column={columns[columnIndex]}
              />,
            ],
            columnIndex + (tc.colSpan ?? 1),
          ],
          [[], 0],
        )[0]
      }
    </tr>
  )
}

type BlockHTMLBuilderMap<E extends Env = Env> = BlockBuilderMap<
  React.ReactNode[],
  React.ReactNode,
  [index: string | number | undefined, env: E, insertBefore?: React.ReactNode]
>

const blockBuilderMap: BlockHTMLBuilderMap = {
  paragraph: (node, _parseInner, parseInnerInline, index, env, insertBefore) => [
    <p key={index}>
      {insertBefore}
      {node.content.map((content, i) =>
        content.type === "break" ? <br key={i} /> : parseInnerInline(content, i, env),
      )}
    </p>,
  ],
  heading: (node, _parseInner, parseInnerInline, index, env, insertBefore) => {
    const { outerHeadingLevel = 0 } = env
    const level = Math.max(1, Math.min(6, Math.round(node.level + outerHeadingLevel))).toString()
    const Heading = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    return [
      <Heading key={index}>
        {insertBefore}
        {node.content.map((content, i) => parseInnerInline(content, i, env))}
      </Heading>,
    ]
  },
  list: (node, parseInner, parseInnerInline, index, env, insertBefore) => {
    const List = node.ordered ? "ol" : "ul"
    return [
      insertBefore,
      <List key={index}>
        {node.content.flatMap(item =>
          item.content.length > 0
            ? [
                <li>
                  {item.inlineLabel?.map((content, i) => parseInnerInline(content, i, env))}
                  {item.content.flatMap((content, i) => parseInner(content, i, env))}
                </li>,
              ]
            : [<li>{item.inlineLabel?.map((content, i) => parseInnerInline(content, i, env))}</li>],
        )}
      </List>,
    ]
  },
  table: (node, _parseInner, parseInnerInline, index, env, insertBefore) => [
    insertBefore,
    <table key={index}>
      {node.caption === undefined
        ? []
        : [
            <caption>
              {intercalate(
                node.caption.map((captionLine, captionLineIndex) =>
                  captionLine.map((content, i) =>
                    parseInnerInline(content, `${captionLineIndex}-${i}`, env),
                  ),
                ),
                [<br />],
              )}
            </caption>,
          ]}
      <thead>
        <TableRow
          cellType="th"
          env={env}
          columns={node.columns}
          cells={node.header}
          parseInnerInline={parseInnerInline}
        />
      </thead>
      {checkTableRowsAreSections(node.rows) ? (
        node.rows.map((section, sectionIndex) => (
          <tbody key={sectionIndex}>
            {section.header ? (
              <TableRow
                cellType="th"
                env={env}
                columns={node.columns}
                cells={section.header}
                parseInnerInline={parseInnerInline}
              />
            ) : undefined}
            {section.rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                cellType="td"
                env={env}
                columns={node.columns}
                cells={row.cells}
                parseInnerInline={parseInnerInline}
              />
            ))}
          </tbody>
        ))
      ) : (
        <tbody>
          {node.rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              cellType="td"
              env={env}
              columns={node.columns}
              cells={row.cells}
              parseInnerInline={parseInnerInline}
            />
          ))}
        </tbody>
      )}
    </table>,
  ],
  container: (node, parseInner, _parseInnerInline, index, env, insertBefore) => [
    <div key={index} className={node.name}>
      <div className="container-header" />
      <div className="container-content">
        {insertBefore}
        {node.content.flatMap((content, i) => parseInner(content, i, env))}
      </div>
      <div className="container-footer" />
    </div>,
  ],
  footnote: (node, parseInner, _parseInnerInline, index, env, insertBefore) => {
    const label = (
      <>
        <span
          className={`footnote__label${typeof node.label === "number" ? " footnote__label--numeric" : ""}`}
          data-reference={node.label.toString()}
          style={
            {
              "--label": node.label.toString(),
            } as React.CSSProperties
          }
        >
          <span className="footnote-label">{node.label.toString()}</span>
          {env.footnoteLabelSuffix ?? ""}
        </span>{" "}
      </>
    )

    return [
      <div key={index} role="note" className="footnote">
        <div className="container-header" />
        <div className="container-content">
          {insertBefore}
          {node.content.flatMap((n, i) => parseInner(n, i, env, i === 0 ? label : undefined))}
        </div>
        <div className="container-footer" />
      </div>,
    ]
  },
  definitionList: (node, parseInner, parseInnerInline, index, env, insertBefore) => [
    insertBefore,
    <dl key={index}>
      {node.content.map((item, itemIndex) => (
        <div key={itemIndex}>
          {item.terms.flatMap((term, termIndex) => (
            <dt key={termIndex}>{term.map((content, i) => parseInnerInline(content, i, env))}</dt>
          ))}
          {item.descriptions.flatMap((def, defIndex) => (
            <dd key={defIndex}>{def.map((content, i) => parseInner(content, i, env))}</dd>
          ))}
        </div>
      ))}
    </dl>,
  ],
}

const builderMap = { ...blockBuilderMap, ...inlineBuilderMap }

export const Markdown: FC<{ source: string; env: Env }> = props => {
  const { source = "...", env } = props
  return <>{renderFromString(source, builderMap, { builderArgs: [undefined, env] }).flat()}</>
}
