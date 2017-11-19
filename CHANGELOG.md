# 0.51.1

- Fixed Auto Updater.
- Added FAQ page.
- It is now possible to change attribute adjustment selection from selected race during character creation.
- Fixed shown special ability groups on character sheet.
- Fixed displayed aspects of liturgical chants.
- Fixed calculating PA on character sheet.
- You can now select the rule books you want to include in the Profile > Rules tab. Inactive book entries will not be displayed (only Races, Cultures, Professions, Skills, Spells and Liturgical Chants).
- Displaying races now corresponds with the Core Rules.
- Fixed inactive Advantages/Disadvantages/Special Abilities list's layout (temporarily).

## macOS

- Added custom titlebar.
- Added *About ...* app menu option.

## German Specific

- Fixed *Visions* and *Sermons* for Blessed Ones.
- Fixed profession *Graumagier (Schule der Verformungen zu Lowangen)*.

# 0.51.0

- Auto-Updater for Windows and macOS.
- Installer for Windows.
- New icon set.
- You can now edit heroes after character creation phase if you check the respective box in the settings.
- Enabled filtering of item templates by combat technique.
- Exported characters will now include the avatar image.
- Added support for permanent LP loss.
- Source book abbreviations will now appear in profession list.
- All lists of skills (skills, spells, liturgical chants) will now show the attribute values if you hover over an list item.
- Fixed calculations of AP spent on **active** advantages/disadvantages/special abiltiies (AP for buying them were still calculated correctly).
- Fixed calculations based on size value (meter-based size entry allowed).
- Fixed surplus page in character sheet PDF.
- Added placeholder wiki boxes for advantages, disadvantages, special abilities and items.
- Fixed available hair colors for some races.

## German Specific

- Added spell and liturgical chant extensions to wiki boxes.
- Fixed text of *magical professions* for culture *Ore Dwarf*.

## Dutch Specific

- Started localization work.

# 0.50.0

- Custom AP cost possible for advantages and disadvantages.
- Fixed ItemEditor's and ArmorZonesEditor's theming and layout.
- Slightly brightened the color for disabled elements.

# 0.49.6

- Fixed dis/advantages from **Aventurian Magic I**.
- Fixed alerts after selecting RCP.
- Alerts might be a bit more responsive (internal rework).
- Fixed *Last Changes* page.

## German Specific

- Added wiki info for cultures.

# 0.49.5

- Special abilities with tiers do not have separate entries anymore.
- RCP costs are now entirely calculated by the app.
- Changed ItemEditor layout from one-column to two-column layout.
- Extended P+T functionality and fixed items based on that.
- Now allows negative AP left during character creation phase.
- Fixed search fields (it unintentionally converted text into a regular expression - thus some strange results).
- Fixed filtering magical tradition's selection objects (previously, having more than 25 AP spent/received for magical advantages/disadvantages adding a tradition was completely disabled).
- Fixed professions requiring specific cultures.
- Fixed *Exceptional Skill/Combat Technique*
- Fixed calculating TOU.
- Fixed showing Own Profession without having extension books in profession list.
- Added prerquisites and special abilities entries for professions' wiki info.
- Fixed disabling to add AE instead of to add permanently lost AE when more than one permanent AE point is lost.
- Wiki test page added.
- Added *Last Changes* tab in *About* section.
- Some further redesign work.
- A short message is now shown in Settings dialog informing about you need to restart the app when changing the language.

## German Specific

- Added (missing) wiki info for skills, cantrips, blessings, spells and liturgical chants (excluding extensions).
- Added special abilities, liturgical chant extensions and dis-/advantages from **Aventurian Work of the Gods**.

# 0.49.4

- Fixed character portrait selection.
- Heaps of stuff for the new design.
- Added theme selection to Settings modal (although the light theme is not finished yet; modals and tooltips are still dark ...).
- Deleting a character must be confirmed now (and cannot be undone after that).
- Now shrinks text in specific fields on character sheet.
- Fixed routine check modifiers on character sheet.
- Unified RCP views.
- Added RCP info views, although a lot of text is still missing.

## German Specific

- Fixed newer items.
- Fixed combat technique values of newer professions.

# 0.49.3

- Fixed AP limits for advantages/disadvantages.
- Removes existing equipment from item templates search results.
- New icon.
- New background.
- Updated titlebar icons on Windows and Linux.

## German Specific

- Fixed Skills selection for *Meistertalentierte*.

## English Specific

- Fixed RCP view issue(s).
- Fixed Equipment view.

# 0.49.2

- Fixed the addition of adventure points.
- Fixed second combat technique selection for professions.
- Fixed Settings modal.
- Fixed small issue concerning `alert`s.
- Item templates are no longer cleared after a new hero has been created.

## German Specific

- Fixed problems with displaying AE for *Intuitiver Zauberer*.

## English Specific

- Fixed race/professions list.

# 0.49.1

- Fixed issue with lists for advantages, disadvantages and special abilities containing skills/spells/liturgical chants.
- Fixed issue with RCP skill specialization selection.
- Fixed exporting heroes as JSON.
- Fixed equipment view.
- Professions are now sorted by name and them by subname (e.g. the academy name). Previously, professions with subnames were sorted randomly (changing from render to render).

## English Specific

- Added translation for skill name separation in RCP skill specialization selection.

# 0.49.0

- *Smash* does not require *Rundumschlag I* anymore.
- Protective/Warding Circles now require *Magical Signs*.
- Added missing *Ancestor Glyphs* from The Warring Kingdoms. They require *Magical Signs* as well.
- *Nimble* now increases MOV by 1.
- *Immunity to (Disease/Poison)* now correctly adds the selected entry.
- Derived characteristics are now correctly calculated on character sheet.
- Item templates have floating number values (again). This **won't** affect non-locked item templates in items.
- Requiring Spells now correctly disables the decrease button if the SR hits the required value.
- Invalid avatar paths will no longer result in a colored border with black background and an invalid file error in the console.
- Now filters Aspect Knowledge selection by active tradition.
- Now sorts lists properly depending on the selected locale (e.g. ä, ö and ü in German are basically treated as a, o and u respectively).
- Items now correcly reset if you load a character after you opened/created a character with items.
- Item weights are now correctly displayed.
- Item PA mods do not use the AT mod value anymore.
- *Improved Dodge I-III* now increases DO value.
- Profession *Spy* now correctly increases *Commerce* by 3.
- The used attributes for the skill check of ODEM ARCANUM are SGC/INT/INT now (following the German Regel-Wiki).
- *Combat Reflexes I-III* now increases INI value.
- Window is maximizable, unmaximizable and resizable.
	- Added a title bar on Windows and Linux, providing buttons in Windows 10 UWP style to minimize, (un)maximize and close the app. This bar is also the draggable area of the window.
- Removed the Start tab.
- Improved general performance.
- In *Profile Overview* and *Character Sheet* tabs, entries such as `Skill Specialization (Climbing: Trees), Skill Specialization (Survival: Find Campsite)` are now written as `Skill Specialization (Climbing: Trees, Survival: Find Campsite)`, providing a better overview and readability in addition to more space.
- A new Redo button is added to the Navigation Bar. History resets after saving, finishing RCP selection and finishing character creation as well as switching to another character.
- Fixed *Property Knowledge*'s and *Aspect Knowledge*'s AP cost and effects.
- Fixed Languages and Scripts selection texts in RCP selections window.
- Fixed loading characters with active Blessings.

## German Specific

- Includes new traditions, aspects and liturgcal chants from **Aventurisches Götterwirken I**.
- Added info for selected race in Races tab.
- CON instead of COU now increases WS value.
- Fixed *Intuitive Caster*'s spell limit and AE value.

## English Specific

- Added info box for selected race in Races tab, but (most of the) texts are still missing.

# 0.48.1

- Undo function is working again for advantages, disadvantages and special abilities.
- Spells can now be de/activated as intended.
- Cantrips/Blessing are now sorted on the character sheet.
- The total attribute maximum is shown on the attribute page during character creation.

# 0.48.0

- Heaps of bugs fixed. I lost sight of all bugs, so I won't provide a detailed list this time.
- Added a funtion to duplicate heroes.
- New interface for managing permanent AE/KP loss.
- Windows x86 support. (I am sorry for all the macOS users out there; I am still searching for a good way to build for Mac as I do not have a Mac at home.)
- Removed support for heroes created with app version lower than 0.45.0.
- If advantage/disadvantage list is empty, a placeholder will be shown. This is to ensure that having an empty list is intentional - and not a bug.

## German Specific

- Aventurian Names, Inns & Taverns, Aventurian Bestiary and The Warring Kingdoms are fully implemented (they should be). All entries from Aventurian Magic I are available. Optional Rules from AMI are not (yet) available.
- AMI is now basically complete. During reworking the entries some issues occured that might cause your characters to not work properly.
	- Selecting *Meistertalentierte*, *Zauberbarden* or *Zaubertänzer* as your magical tradition requires a second selection. *Meistertalentierte* choose their *Meistertalent*, *Zauberbarden* or *Zaubertänzer* choose their music/dance tradition (Ceoladir etc). If the affected characters are in character creation phase, you will be able to remove the existing tradition special ability and reactivate it with the correct selection. If character creation is finished, you have to create the respective character(s) again.
	- *Exorzist I* and *Meistertrick I* were missing selection options. Now they are included. The selection options do not affect the AP cost, so you can try to fix it the same way as you did for the magical tradition above.

# 0.47.3

- The requirement *Manifesto 10* for Elemental Servant referred to Wall of Fog instead of Manifesto.

# 0.47.2

- The calculations of total weight and total price in equipment tab should work again. Armor is excluded from the total weight calculation, because armor is excluded from carrying capacity if its in use.
- Character Sheet is working again.
- The skills tab contains a pane on the right side. If you click on the "i" buttons, it will show you additional information about the respective skill. Well, it will show you in the future: Currently, there is not much data available to show.
- The item list now properly resets for every new character.

# 0.47.1

- Fixed an issue with a race or a culture as a requirement. This issue caused some professions to never appear in the list.

# 0.47.0

Initial English release.
