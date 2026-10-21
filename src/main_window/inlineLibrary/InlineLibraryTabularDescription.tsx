import type { AvailableCreatorEntity } from "@optolith/entity-descriptions"
import type { TabularEntityDescription } from "@optolith/entity-descriptions/description"
import { observer } from "mobx-react"
import { FC } from "react"
import { InlineMarkdown, Markdown, type Env } from "../../shared/components/markdown/Markdown.tsx"
import { useTranslate } from "../../shared/hooks/translate.ts"
import type { FCC } from "../../shared/utils/react.ts"

type Props = {
  description: TabularEntityDescription<AvailableCreatorEntity, string>
  env: Env
}

/**
 * Displays all information about a selected entry in a sidebar.
 */
export const InlineLibraryTabularDescription: FC<Props> = observer(({ description, env }) => {
  const translate = useTranslate()
  const colCount = Object.keys(description.values).length

  return (
    <Table columnLabels={description.labels} env={env}>
      <tbody>
        <tr>
          {Object.keys(description.labels).map((col, index) => (
            <td className={`tde-col-${col}`} scope={index === 0 ? "rowgroup" : undefined}>
              <InlineMarkdown
                source={description.values[col as keyof typeof description.values] ?? ""}
                env={env}
              />
            </td>
          ))}
        </tr>
        {description.additionalInformation?.map(info => (
          <tr className="tde-additional-information">
            <td className="tde-entity-id"></td>
            <th className="tde-additional-information-label" scope="row">
              <InlineMarkdown source={info.label} env={env} />
            </th>
            <td className="tde-additional-information-value" colSpan={colCount - 1}>
              <div className="preview">
                <Markdown source={info.value} env={env} />
              </div>
            </td>
          </tr>
        ))}
        {description.references === undefined ? undefined : (
          <tr className="sources">
            <td className="tde-entity-id"></td>
            <th className="tde-additional-information-label" scope="row">
              {translate("Rule Sources")}
            </th>
            <td colSpan={colCount}>{description.references}</td>
          </tr>
        )}
      </tbody>
    </Table>
  )
})

const Table: FCC<{
  caption?: string
  tableClass?: string
  columnLabels: Record<string, string>
  env: Env
}> = ({ caption, tableClass, columnLabels, env, children }) => (
  <table className={`tde-table tde-table--alt ${tableClass}`}>
    {caption === undefined ? undefined : (
      <caption>
        <InlineMarkdown source={caption} env={env} />
      </caption>
    )}
    <thead>
      <tr>
        {Object.entries(columnLabels).map(([col, value]) => (
          <th className={`tde-col-${col}`} scope="col">
            <InlineMarkdown source={value} env={env} />
          </th>
        ))}
      </tr>
    </thead>
    {children}
  </table>
)
