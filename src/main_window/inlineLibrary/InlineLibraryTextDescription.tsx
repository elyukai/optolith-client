import { isNotNullish } from "@elyukai/utils/nullable"
import { toKebabCase } from "@elyukai/utils/string"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { AvailableCreatorEntity } from "@optolith/entity-descriptions"
import type {
  EntityDescriptionSection,
  TextEntityDescription,
} from "@optolith/entity-descriptions/description"
import { FC } from "react"
import { InlineMarkdown, Markdown, type Env } from "../../shared/components/markdown/Markdown.tsx"
import { useTranslate } from "../../shared/hooks/translate.ts"
import type { Translate } from "../../shared/utils/translate.ts"

type Props = {
  description: TextEntityDescription<AvailableCreatorEntity>
  env: Env
  specialTag: string | undefined
}

// const getSkillColor = (skill: Skill): string | undefined => skillGroups[skill.group]?.color.kind

// const isTraditionArtifactEnchantment = (entity: Extract<keyof EntityMap, string>): boolean =>
//   entity in TraditionArtifactEnchantmentIdentifier.type.value.values

// const isMagicalAction = (entity: Extract<keyof EntityMap, string>): boolean =>
//   entity in MagicalActionIdentifier.type.value.values

const subtitleFallback = (
  entityName: AvailableCreatorEntity,
  translate: Translate,
): string | undefined => {
  switch (entityName) {
    case "Profession":
    case "ProfessionVersion":
      return translate("Profession Package")
    case "OptionalRule":
      return translate("Optional Rule")
    default:
      return undefined
  }
}

/**
 * Displays all information about a selected entry in a sidebar.
 */
export const InlineLibraryTextDescription: FC<Props> = ({ description, env, specialTag }) => {
  const translate = useTranslate()

  const subtitle = description.subtitle ?? subtitleFallback(description.entityName, translate)

  return (
    <article className={[description.entityName, specialTag].filter(isNotNullish).join(" ")}>
      <header>
        <h2>
          {description.title}
          {description.badge === undefined ? null : (
            <>
              {" "}
              <span
                aria-hidden="true"
                className={`badge badge--${toKebabCase(description.badge.type)}`}
              >
                {description.badge.value}
              </span>
            </>
          )}
        </h2>
        {subtitle === undefined ? null : <p>{subtitle}</p>}
      </header>
      <InlineLibraryTextDescriptionBody body={description.body} env={env} />
      {description.references === undefined ? null : (
        <footer>
          <p className="sources">{description.references}</p>
        </footer>
      )}
    </article>
  )
}

const InlineLibraryTextDescriptionBody: FC<{ body: EntityDescriptionSection[]; env: Env }> = ({
  body,
  env,
}) => (
  <div className="preview">
    {body.map((section, index) => (
      <InlineLibraryTextDescriptionSection key={index} section={section} env={env} />
    ))}
  </div>
)

const TableRow: FC<{ row: string[]; env: Env; cellType: "th" | "td" }> = ({
  row,
  env,
  cellType,
}) => {
  const Cell = cellType
  return (
    <tr>
      {row.map((cell, index) => (
        <Cell key={index}>
          <BlockOrInlineMarkdown source={cell} env={env} />
        </Cell>
      ))}
    </tr>
  )
}

const InlineLibraryTextDescriptionSection: FC<{ section: EntityDescriptionSection; env: Env }> = ({
  section,
  env,
}) => {
  switch (section.type) {
    case "plain":
      return <Markdown source={section.text} env={env} />
    case "table":
      return (
        <table>
          <thead>
            <TableRow row={section.header} env={env} cellType="th" />
          </thead>
          <tbody>
            {section.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} row={row} env={env} cellType="td" />
            ))}
          </tbody>
          {section.footer === undefined ? undefined : (
            <tfoot>
              <TableRow row={section.footer} env={env} cellType="td" />
            </tfoot>
          )}
        </table>
      )
    case "definitionList":
      return (
        <dl>
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex}>
              <dt>
                <InlineMarkdown source={item.label} env={env} />
              </dt>
              <dd>
                {typeof item.value === "string" ? (
                  <BlockOrInlineMarkdown source={item.value} env={env} />
                ) : (
                  item.value.map((nestedItem, nestedItemIndex) => (
                    <InlineLibraryTextDescriptionSection
                      key={nestedItemIndex}
                      section={nestedItem}
                      env={env}
                    />
                  ))
                )}
              </dd>
            </div>
          ))}
        </dl>
      )
    case "labeled":
      return (
        <>
          <h3 className="tde-label">
            <InlineMarkdown source={section.label} env={env} />
          </h3>
          <InlineLibraryTextDescriptionSection section={section.value} env={env} />
        </>
      )
    default:
      return assertExhaustive(section)
  }
}

const BlockOrInlineMarkdown: FC<{ source: string; env: Env }> = props =>
  props.source.includes("\n") ? <Markdown {...props} /> : <InlineMarkdown {...props} />
