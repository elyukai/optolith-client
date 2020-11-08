## 1.4.2

### Enhancements

- Der Start der Anwendung war viel langsamer als in Version 1.3.2. [#751](https://github.com/elyukai/optolith-client/issues/751)

### Fehlerbehebungen

- Das Maximum von Kampftechniken konnte höher sein als es die Regeln eigentlich erlauben. [#749](https://github.com/elyukai/optolith-client/issues/749)
- Der Abstand von Overlays – also z. B. wenn Vorteile hinzugefügt werden – nach oben war zu klein. [#727](https://github.com/elyukai/optolith-client/issues/727)
- Wenn eine Profession es erlaubt hat, aus einer Menge an Kampftechniken eine zweite für einen niedrigeren Bonus als den der ersten auszuwählen, wurde dieser niedrigere Bonus nicht auf den Charakter angewandt. [#647](https://github.com/elyukai/optolith-client/issues/647)
- Die *Fackel* hatte als L+S KK 15 statt KK 14. [#752](https://github.com/elyukai/optolith-client/issues/752) [#737](https://github.com/elyukai/optolith-client/issues/737)
- Der Schadensbonus durch L+S wurde bei Waffen, die keinen festen Schaden hatten, nicht berücksichtigt. [#737](https://github.com/elyukai/optolith-client/issues/737)
- Es konnte nur ein Talentstil zur gleichen Zeit aktiv sein, obwohl es keine Einschränkung diesbezüglich gibt. [#665](https://github.com/elyukai/optolith-client/issues/665)
- Die Profession *Weißmagier (Akademie Schwert und Stab zu Gareth)* aus dem **Regelwerk** hatte falsche AP-Kosten und *Sternkunde 4* statt *Alchemie 4*. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Das Talentefeld für Tierbegleiter auf dem Charakterbogen was zu klein, um alle relevanten Talente aufnehmen zu können. [#733](https://github.com/elyukai/optolith-client/issues/733)
- Im Regeltext für das *Großzelt, 12 Personen* fehlte ein Wort. [#739](https://github.com/elyukai/optolith-client/issues/739)
- SF *Anhänger des Güldenen* erlaubte Liturgien bis Steigerungsfaktor C, obwohl nur welche bis B erlaubt sind. [#754](https://github.com/elyukai/optolith-client/issues/754)
- SF *Scholar des Magierkollegs zu Honingen* fehlte. [#726](https://github.com/elyukai/optolith-client/issues/726)
- SF *Havena-Stil* fehlte. [#740](https://github.com/elyukai/optolith-client/issues/740)
- Der Name des Feenpaktgeschenks *Ruf des Waldes* hatte einen Schreibfehler. [#755](https://github.com/elyukai/optolith-client/issues/755)
- Profession *Gildenloser Magier nach Vadif sal Karim* hatte eine Bonus auf den falschen *Hagelschlag*-Zauber. [#772](https://github.com/elyukai/optolith-client/issues/772)
- Der Text der dritten Erweiterung des Zaubers *Klarheit des Eises* hatte eine falsche Zeiteinheit in der Zeitangabe. [#766](https://github.com/elyukai/optolith-client/issues/766)
- Der SF *Spiritualistinnen* hatte falsche erweiterte Sonderfertigkeiten. [#763](https://github.com/elyukai/optolith-client/issues/763)
- SF *Klingensturm* hatte falsche Kampftechniken angegeben. [#768](https://github.com/elyukai/optolith-client/issues/768)
- Bilder mit großgeschriebenen Dateiendungen wurden als Portraits nicht akzeptiert. [#762](https://github.com/elyukai/optolith-client/issues/762)
- Wenn ein Portrait fehlte, wurde auf dem Charakterbogen das Upload-Icon angezeigt. [#759](https://github.com/elyukai/optolith-client/issues/759)
- Auf dem Mac wurden, wenn eine Papiertextur für den Charakterbogen ausgewählt wurde, zusätzliche leere Seiten generiert. [#748](https://github.com/elyukai/optolith-client/issues/748)
- Der Effekttext der SF *Bindung des Dolches* hatte einen Schreibfehler. [#773](https://github.com/elyukai/optolith-client/issues/773)

### Danke

Zu guter Letzt ein großes **Danke** an alle, die über verschiedeste Kanäle Feedback geben und helfen, sowie an die folgenden Menschen auf GitHub, die an dieser Version mitgewirkt haben!

- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

## 1.4.1

### Fehlerbehebungen

- Italienisch war nicht verfügbar.

## 1.4.0

### Features

- **Havena &ndash; Versunkene Geheimnisse** [#460](https://github.com/elyukai/optolith-client/issues/460)
- **Unendlichkeit & Tiefenrausch** [#461](https://github.com/elyukai/optolith-client/issues/461)
- **Katakomben & Ruinen** [#462](https://github.com/elyukai/optolith-client/issues/462)
- Italienische Übersetzung [#667](https://github.com/elyukai/optolith-client/issues/667) [#610](https://github.com/elyukai/optolith-client/issues/610)
- Optionaler Charakterbogenhintergrund in Papieroptik. [#36](https://github.com/elyukai/optolith-client/issues/36)
- Zoom-Option für Charakterbogen-Ansicht. [#665](https://github.com/elyukai/optolith-client/issues/665)
- Geld zum Geldbeutel hinzufügen oder davon abziehen. [#666](https://github.com/elyukai/optolith-client/issues/666)
- Eigene Vorteile, Nachteile und Sonderfertigkeiten mit eigenem Namen und AP-Wert erstellen (temporäre Lösung). [#632](https://github.com/elyukai/optolith-client/issues/632)

### Verbesserungen

- Im Ausrüstungstab wird das Gewicht nun in einer eigenen Spalte angezeigt. [#305](https://github.com/elyukai/optolith-client/issues/305)
- Unnötige Kampfbögen werden jetzt nicht mehr angezeigt und exportiert, stattdessen basiert die Anzeige nun darauf, welche Rüstungen der jeweilige Charakter besitzt. Der Kampfbogen für Komplettrüstungen wird angezeigt, wenn der Charakter keine Rüstung besitzt. [#407](https://github.com/elyukai/optolith-client/issues/407)
- Der Name eines Eintrags zeigt nun, wie der Info-Button am Ende, den Regeltext des Eintrags an. [#556](https://github.com/elyukai/optolith-client/issues/556)

### Fehlerbehebungen

- Waffen aus **Aventurische Magie I** wurden nicht angezeigt. [#617](https://github.com/elyukai/optolith-client/issues/617)
- Gegenstände aus **Aventurische Magie II** wurden nicht angezeigt. [#659](https://github.com/elyukai/optolith-client/issues/659)
- In der Beschreibung der SF *Metessa Galora-Stil* war ein Schreibfehler. [#635](https://github.com/elyukai/optolith-client/issues/635)
- SF *Tannhaus-Stil* hatte eine falsche Kampftechniken-Angabe. [#634](https://github.com/elyukai/optolith-client/issues/634)
- SF *Sippenkrieger-Stil* hatte falsche erweiterte Sonderfertigkeiten. [#587](https://github.com/elyukai/optolith-client/issues/587)
- Bei der Profession *Golgarit* und dessen Variante *Untotenjäger* fehlte die SF *Berittener Kampf*. [#597](https://github.com/elyukai/optolith-client/issues/597)
- Die Profession *Ingerimmgeweihter* hatte falsche AP-Kosten und ihr fehlte eine Liturgie. [#574](https://github.com/elyukai/optolith-client/issues/574)
- Die Varianten der Profession *Borongeweihter* hatten falsche Talentmodifikationen. [#548](https://github.com/elyukai/optolith-client/issues/548)
- SF *Rabenschwestern (Seherin von Heute und Morgen)* hatte falsche erweiterte Sonderfertigkeiten. [#639](https://github.com/elyukai/optolith-client/issues/639)
- Profession *Kammerdiener (Zofe)* hatte einen Bonus auf das falsche Talent. [#614](https://github.com/elyukai/optolith-client/issues/614)
- SF *Elfenfreund* hatte Errata, die aber noch nicht eingepflegt waren. [#621](https://github.com/elyukai/optolith-client/issues/621)
- Profession *Weißmagier (Schwert & Stab zu Gareth)* hatte einen falschen AP-Wert und eine zusätzliche Talentmodifikation. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Der Name der Variante *Pfad der Wächterin* der Profession *Gildenlose Magierin (Bannakademie von Fasar)* hatte einen Schreibfehler. [#566](https://github.com/elyukai/optolith-client/issues/566)
- Zauber *Skelettarius* hatte die Zauberweiterung *Längere Dienste* statt *Längerer Dienst* und auch einen falschen Beschreibungstext. [#602](https://github.com/elyukai/optolith-client/issues/602)
- Spezifisch definierte übliche Professionen einer Kultur werden nun auch dann angezeigt, wenn sie nicht aus dem **Regelwerk** stammen. [#563](https://github.com/elyukai/optolith-client/issues/563)
- SF *Balboram-Stil* hatte Lanzenangriff I statt Beidhändiger Kampf I als Voraussetzung. [#563](https://github.com/elyukai/optolith-client/issues/563)
- Der Erfahrungsgrad *Brillant* wurde zuvor Brilliant geschrieben. Das gleiche Problem gab es auch bei anderen Einträgen. [#567](https://github.com/elyukai/optolith-client/issues/567)
- Zauber *Halluzination* hatte als Verbreitung Elfen, obwohl es Druiden hätte sein müssen. [#564](https://github.com/elyukai/optolith-client/issues/564)
- Das Interface konnte kleiner skaliert werden. [#487](https://github.com/elyukai/optolith-client/issues/487)
- Schelmenstreiche zeigten keine Wirkungsdauer an, obwohl sie eine besitzen. [#663](https://github.com/elyukai/optolith-client/issues/663)
- Waffen der Kampftechnik *Lanzen* wurden nicht auf dem Heldenbogen abgezeigt. [#662](https://github.com/elyukai/optolith-client/issues/662)
- Eigenschaften ignorierten das Minimum, welches durch höhere Fertigkeitswerte entsteht. Das Maximum für Fertigkeitswerte ist die höchste an der Probe beteiligte Eigenschaft&thinsp;+&thinsp;2, wodurch die höchste Eigenschaft mindestens FW&thinsp;&minus;&thinsp;2 sein muss. [#630](https://github.com/elyukai/optolith-client/issues/630)
- Das neue Anwendungsgebiet *Fachpublikationen* für das Talent *Rechtskunde* hatte eine falsche Sonderfertigkeitsvoraussetzung. [#680](https://github.com/elyukai/optolith-client/issues/680)
- Geweihte des Namenlosen konnten keine Segnungen kaufen. [#657](https://github.com/elyukai/optolith-client/issues/657)
- Einige Listeneinträge waren breiter als die eigentliche Liste. [#683](https://github.com/elyukai/optolith-client/pull/683)
- SF *Kind der Natur* und ähnliche SFs erlaubten nur ein Talent. [#649](https://github.com/elyukai/optolith-client/issues/649)
- Listenüberschriften waren standardmäßig nicht zentriert. [#637](https://github.com/elyukai/optolith-client/issues/637)
- SF *Fachwissen* hatte unerwartete Zeichen im generierten Namen. [#611](https://github.com/elyukai/optolith-client/issues/611)
- Permanent ausgegebene LE verbot den Kauf weiterer LeP. [#606](https://github.com/elyukai/optolith-client/issues/606)
- Wenn KO auf 8 war und keine Einträge von ihr abhingen, konnten keine weiteren LeP gekauft werden. [#694](https://github.com/elyukai/optolith-client/issues/694)
- *Aspektkenntnis*-SFs konnten trotz des Minimums von mindestens drei Liturgien des Aspekts auf FW 10 oder höher nicht gekauft werden. [#591](https://github.com/elyukai/optolith-client/issues/591)
- Der Zaubertrick *Hexenblick* konnte von allen Zauberern gekauft werden. [#377](https://github.com/elyukai/optolith-client/issues/377)
- Zaubertänzer konnten keine Zaubertänze kaufen. [#594](https://github.com/elyukai/optolith-client/issues/594)
- Die Varianten der Zaubertänzer und -barden berücksichtigten ihre jeweiligen Kultur- und ggf. Geschlechtsvoraussetzungen nicht. [#565](https://github.com/elyukai/optolith-client/issues/565)
- Wenn bei einer Profession neben der Auswahl einer oder mehrerer Kampftechniken für einen bestimmten KtW eine oder mehrere weitere Kampftechniken für einen niedrigeren KtW ausgewählt werden sollen (z. B. bei der Profession *Soldat*), war dies nicht möglich. [#647](https://github.com/elyukai/optolith-client/issues/647)
- Die SFs *Gift melken (...)* beschrieben ein neues Einsatzgebiet, gemeint ist eine *Einsatzmöglichkeit*. [#651](https://github.com/elyukai/optolith-client/issues/651)
- Die Beschreibung des Zaubers *Gletscherform* entsprach nicht dem Text aus **Aventurische Magie II**. [#654](https://github.com/elyukai/optolith-client/issues/654)
- Meldungen des Updaters sowie der Suche-nach-Updates-Button sind nun auf macOS deaktiviert, da dort aktuell keine automatischen Updates möglich sind. [#589](https://github.com/elyukai/optolith-client/issues/589)
- Die SF *Feindgespür* nannte falsche Kampftechniken, für die die SF gilt. [#658](https://github.com/elyukai/optolith-client/issues/658)
- Auto-Update-Warnungen wurden auf Linux gezeigt selbst wenn keine direkten Auto-Updates möglich waren. [#573](https://github.com/elyukai/optolith-client/issues/573)
- Bei der SF *Zugvögel* und SFs mit vergleichbaren Effekten wurden die zusätzlich ermöglichten Liturgieplätze durch passende aktive Liturgien, die allerdings auch für die eigentliche Tradition der Geweihten verfügbar waren, blockiert. [#677](https://github.com/elyukai/optolith-client/issues/677)
- Die SF *Giftverstärkung* hatte einen falschen Regeltext. [#713](https://github.com/elyukai/optolith-client/issues/713)
- Beim Exportieren eines Charakters als JSON wurde im Speichern-Dialog die Dateiendung nicht an den vorgeschlagenen Dateinamen angefügt. [#718](https://github.com/elyukai/optolith-client/issues/718)

### API

Die nächste Release wird wichtige und mit vorherigen Versionen inkompatible Änderungen mit sich bringen, wenn du also Optolith-Quelldateien oder -Speicherdateien nutzt, würde ich dir empfehlen, mal auf [Discord](https://discord.gg/wfdgB9g) vorbeizuschauen, da kann ich dir dann alles im Detail erläutern. Da mehr und mehr Menschen von der Optolith-Datenbasis abhängen, werde ich ab jetzt Semantic Versioning strikt folgen, sodass du dich allein auf Basis der Version darauf verlassen kannst, dass du mit deiner Software immer noch damit arbeiten kannst. Es wird ein neues Format für Charaktere, aber auch für sämtliche Wikieinträge geben. Du kannst mir auch immer noch Feedback zukommen lassen, da noch nicht alles bis ins letzte Detail fertig ist &ndash; aber ich denke, es macht immer noch Sinn, sich diese Änderungen recht früh anzusehen. Die nächste major Version ist immer noch ein gutes Stück entfernt, sodass noch mehr als genug Zeit ist, um deine Software anzupassen.

### Danke

Zu guter Letzt ein großes **Danke** an die folgenden Menschen auf GitHub, die an dieser Version mitgewirkt haben!

- [Jonas (@Rahjenaos)](https://github.com/Rahjenaos)
- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [manuelstengelberger (@manuelstengelberger)](https://github.com/manuelstengelberger)
- [Philipp A. (@flying-sheep)](https://github.com/flying-sheep)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

## 1.3.2

### Fehlerbehebungen

- SF Wege der Gelehrten: Es fehlten einige Auswahlmöglichkeiten. #517
- Neue Kampftechniken aus Büchern abseits des Regelwerks fehlten im Kampftechniken-Tab. #543
- Die Beschreibung der Kampftechnikauswahl bei Professionsvarianten wurde nicht richtig angezeigt.
- Die Sozialstatusvoraussetzung für *Herrschaftsanspruch* funktionierte nicht.
- Profession *Lanisto*: Die Fertigkeitsspezialisierung galt für das falsche Talent.
- Professionen haben ihre Abhängigkeiten nicht beachtet.
- In den persönlichen Daten hatte das Textfeld „Titel“ die falsche Beschriftung.
- Falsche Volumenangaben in der Effektbeschreibung des Zaubers *Manifesto*.
- Profession *Hazaqi*: *Steinbearbeitung* 4 ist jetzt *Stoffbearbeiung* 4.
- Berufsgeheimnisse aus der *Rüstkammer der Streitenden Königreiche* fehlten. #474
- SF *Bindung des Bannschwerts* hatte keine Kosten. #490
- *Götter & Kulte* war bei den meisten Geweihtenprofessionen auf FW 6. #475
- Auf dem PDF wurde die Zustand/Status-Tabelle abgeschnitten, was aber nicht in der PDF-Vorschaut in Optolith der Fall war. #473
- SF *Waldritter-Stil* war nicht wählbar. #478
- SF *Angetäuschter Angriff* hatte als Voraussetzung KK 15 statt GE 15. #481
- Die `config.json` hat immer noch bei vielen Fehler geworfen. Das Problem sollte nun endgültig gebannt sein. #476
- In sehr seltenen Fällen wurden Teile der Heldendatei oder die gesamte Heldendatei gelöscht. Das Schreiben von Heldendateien wurde daher komplett neu geschrieben und zusammengefasst, um weiteren Fehlern vorzubeugen. #477
- Fehlenden Garethi-Dialekt *Nostrisch* hinzugefügt. #480
- SF Kraftkontrolle hatte als Voraussetzung statt Leiteigenschaft 15 Leiteigenschaft 13. #471
- Fehler bei Drittanbieterlizenzen behoben. #471
- Typo im Namen des Hardas-Stils korrigiert. #469

### Bekannte Fehler

- Einige Einträge, die komplexere Voraussetzungen haben, können diese Voraussetzungen falsch *anzeigen*, sie aber trotzdem richtig *verwenden*.

## 1.3.1

### Fehlerbehebungen

- In der französischen Version fehlten alle Einträge, die zur Heldenerschaffung nötig sind (Spezies etc.). Sie waren vorhanden, wurden aber nicht in der Liste angezeigt. #449
- Es gab Fehler, weil die Config unbekannte Keys hatte, wodurch Optolith nicht startete. #450
- Auf dem Heldenbogen wurden Status nur in einer Spalte dargestellt, wenn es eine gerade Anzahl war. #448

## 1.3.0

### Neue Features

- Französische Version (inkl. Regelwerk) #34
- Aventurische Magie 2 #41
- Aventurisches Kompendium 2 #93

### Verbesserungen

- Das Suchfeld im Wiki wird jetzt nicht mehr gelöscht, wenn man die Kategorie wechselt. #286
- Wenn der Import eines Helden fehlschlägt, werden nun genauere Infos gegeben, was genau das Problem war. (inkompatible Version, invalide Datei, etc.) #343 #394
- Komplett neuer Datenbankunterbau und dadurch Ladezeitersparnis von ca. 50%

### Fehlerbehebungen

- Der Cache für AP funktioniert jetzt wieder ordnungsgemäß, wenn man nicht alle Helden speichert. #416
- Die Sprachtabelle verzerrte das Layout, wenn Hjaldisch/Saga-Thorwalsch aktiv war. #419
- SF *Zugvögel*: Statt Rahjaliturgien standen Travialiturgien zur Auswahl. #423
- Die Texte bei den persönliche Daten auf dem Heldenbogen wurden teilweise beschnitten. #413
- Die Profession *Schwarzmagier (Schüler des Demirion Ophenos)* hatte falsche AP-Kosten. #344
- Die Ausrichtung des Gesamtgewichts auf dem Besitz-Bogen wurde behoben. #291
- Ein Gegenstand konnte nicht als improvisierte Waffe eingetragen werden. #290
- SF *Jägerinnen der weißen Maid*: Mögliche Liturgien zeigten keine Aspekte an. #289
- Die Infotabelle für Routineproben war nicht richtig ausgerichtet. #214
- Angst vor: Auswahl/eigener Text wurde auf dem Heldenbogen nicht angezeigt. #213
- Man konnte keine Bilder von einem Server als Bild importieren. #229
- Das Hinzufügen von AP funktionierte nicht, wenn man nicht das Eingabefeld verlassen hat. #341
- Waffen, die keinen Schaden verursachen, zeigen nicht mehr nur "W" als Schaden. #353
- Keine Talentwertverringerung *Fährtensuche* mehr möglich bei Jäger (Kopfgeldjäger). #357
- SF *Vorstoß* hatte KT Schwerter doppelt aufgeführt. #355
- Ein exportierter Held mit einer BOM konnte nicht gelesen werden. #37
- Gegenstandsänderungen konnten in bestimmten Situationen nicht gespeichert werden. #389
- Fehler behoben, dass das Feld "Wo getragen?" bei Gegenständen nicht gespeichert wurde. #369
- Die Zaubertricks Hexenblick und Elfenhaar sind jetzt nur noch für Hexen bzw. Elfen wählbar. #377
- Die Obergrenze durch die Leiteigenschaft bei Kampftechniken funktioniert jetzt wieder. #379
- Typo in ATTRIBUTO (Körperkraft), zweite Erweiterung behoben. #366
- Wurfnetz war bei *Schleudern* anstelle bei *Wurfwaffen* hinterlegt. #345
- Typo im Text der SF *Abrichter* behoben. #342
- Die Anwendungskonfiguration wirft jetzt keine Fehler mehr hervor. #358

### API

Es gibt auf [GitHub](https://github.com/elyukai/optolith-client/tree/master/app/Schema/Hero) jetzt ein einfaches Schema zum Validieren eines Helden. Ein vollständiges Schema ist in Arbeit; die unfertige Version davon findet sich ebenfalls im verlinkten Ordner.

## 1.2.0

Diese Release ist hauptsächlich für andere Sprachen, da es Optolith jetzt auch auf Niederländisch gibt und English an Büchern aufgeholt hat. Allerdings gibt es auch viele relevante Fehlerbehebungen und kleine Verbesserungen.

### Neue Features

- Niederländische Version (inkl. Regelwerk)
- Neue Bücher auf Englisch

### Verbesserungen

- Schilde werden normalerweise nicht als Primärwaffe genutzt, weshalb der doppelte Paradebonus nun standardmäßig auf dem Heldenbogen eingerechnet wird und nicht mehr der einfache.
- Verbessertes Ausweichen I–III erhöht AW nicht mehr, da dies nur passieren darf, wenn man keine Rüstung trägt.
- *Saga-Thorwalsch* in *Hjaldinsch/Saga-Thorwalsch* umbenannt.
- SF Variante (beide) in *Zaubererweiterung* und *Liturgieerweiterung* umbenannt.

### Fehlerbehebungen

- Die Optionalregel *Höhere Paradewerte* erhöhte AW um 2 bzw. 4, obwohl es eigentlich nur 1 bzw. 2 sind.
- Eine Zauber der Tradition (Scharlatan) hatten diese nicht als Tradition eingetragen.
- Vorteil *Leichter Gang* hat die GS nicht erhöht.
- Nachteil *Pech I-III* hat die maximalen SchiPs auf dem Heldenbogen nicht verringert.
- Das Fenster für permanent ausgegebene Astralenegie und Karmaenergie war nicht schließbar.
- Nachteil *Stigma (Grüne Haare)* ändert die Haarfarbe jetzt auf Grün.
- Die Bildvorschau zeigt jetzt auch PNGs und nicht mehr nur JPEGs an.
- Muttersprache (MS) konnte nicht als Stufe für Sprachen selektiert werden.
- Der Schließen-Button des App-Fensters funktionierte nicht.
- Fehlermeldungen beim Import-/Export-Abbruch entfernt.
- SERPENTIALIS ist jetzt für Hexen und nicht mehr für Elfen.
- Feenpaktgeschenke haben jetzt Beschreibungen.
- Persönlichkeitsschwäche: Es ist jetzt möglich, so viele Vorurteil/Weltfremd-Einträge zu kaufen wie man möchte.
- Für Professionen erforderliche Eigenschaftswerte werden jetzt auch so eingetragen.
- SF Merkmalskenntnis funktionierte nicht und hatte eine falsche Kostenberechnung.
- Halbgötter waren nicht als Anwendungsgebiete für *Götter & Kulte* verfügbar.
- Fehlende Heilkräuter hinzugefügt.
- Das Neuauswürfeln des Gewichts ohne eine bereits eingetragene Größe geht nun nicht mehr von einer Größe von 0 aus, sondern würfelt erst die Größe neu aus und lässt diesen Wert dann in das Gewicht einfließen.
- Wenn die KK 8 ist, ist die Tragkraft nicht mehr 0 sondern 16.
- Kampftechnikanpassungen in Professionsvarianten wurden nicht korrekt dargestellt.
- Der Standardname für einen exportierten Heldenbogen ist jetzt der Name des Helden.
- Das Maximum für Fremdzauber griff auch noch nach der Heldenerstellung.
- Helden, die von der aktuell ausgeführten Optolith-Version nicht unterstützt werden, werden nicht mehr geladen bzw. angezeigt.
- SF Athlet: Falsche Voraussetzungen
- SF Buchdrucker: Falsche Voraussetzungen
- Wenn ein Zauber für die Tradition Gildenmagier ausgewählt werden soll, werden Zauber der Tradition Allgemein ausgeblendet.
- Umlautzeichen in Listenelementen werden jetzt nicht mehr abgeschnitten.
- Die gewählte Sprache eines Helden wurde nicht gespeichert.
- Pakte wurden nicht gespeichert.
- SF Kupferstich: Falsche Voraussetzungen
- Das Feld *Verbreitung* hat die Tradition (Namenloser) nicht aufgeführt.
- Zu lange Liturgienamen werden auf dem Heldenbogen jetzt als Abkürzung dargestellt.
- Die Liturgietabelle auf dem Liturgiebogen hatte teilweise falsche Überschriften.
- Bann-/Schutzkreise werden auf dem Heldenbogen jetzt korrekt angezeigt.
- Erweiterte Liturgiesonderfertigkeiten wurden häufig nicht durch Liturgiestile freigeschaltet.
- Nachteil *Unfähig* hatte den Vorteil *Begabung* als Ganzes verboten und nicht nur das jeweilige Talent.
- Das Maximum von Kampftechniken durch die Leiteigenschaft greift jetzt auch während der Heldenerstellung.
- Hat man die Tradition Meistertalentierte ausgewählt, wurden die in Vorteile und Nachteile ausgegebenen AP nicht angezeigt.
- SF Lieblingszauber erlaubt jetzt das Auswählen inaktiver Zauber nicht mehr.
- Der Anteil der Kopfrüstung und der Torsorüstung bei Zonenrüstung war vertauscht.
- SF Baliho-Stil hatte Schilddeckung als mögliche erweiterte Kampfsonderfertigkeit aufgezählt, obwohl es Schildstoß hätte sein müssen.

## 1.1.2

### Verbesserungen

- Die Meldung beim Laden ist jetzt auf Deutsch.
- Das Abschließen der SKP-Auswahl kann jetzt rückgängig gemacht werden.

### Fehlerbehebungen

- Kampfsonderfertigkeiten zeigen jetzt wieder ihren Typ (passiv/Basismanöver/Spezialmanöver) im Wiki an.
- Zauber nach Gruppe zu sortieren sortiert die Gruppen jetzt alphabetisch.
- Auf EG *Unerfahren* kann mal als Gildenmagier jetzt auch den ausgewählten Fremdzauber (der jetzt keiner mehr ist) auswählen.
- In der Auswahlliste für SF *Tradition (Gildenmagier)* werden jetzt keine traditionseigenen Zauber mehr angezeigt.
- Das englische User Interface lädt jetzt wieder ohne Probleme.
- Profession *Akademie von Licht und Dunkelheit* kann jetzt wieder ohne UI-Fehler ausgewählt werden.

## 1.1.0/1.1.1

*Die genaue Versionsnummer der App ist 1.1.1.*

Nach mehr als über einem Jahr kommt nun endlich ein großes Update – auch wenn man es als Benutzer nicht unbedingt mitbekommt: Optolith hat einen komplett neuen Code bekommen. Mit einher geht eine interne Umstrukturierung, sodass Features wie Gruppen in Zukunft performant möglich sein werden. Das ist zwar die größte Änderung, aber nicht die einzige: Sämtliche gemeldeten Bugs sind behoben und über die letzten zwei Wochen haben meine Tester auch noch diverse Bugs gefunden, die hiermit auch behoben werden.

Vermutlich werdet ihr feststellen, dass Optolith ein paar Sekunden länger braucht zum Laden als vorher. Das liegt daran, dass ich Optolith neu gebaut habe mit dem Grundgedanken, dass es stabiler läuft. Ich führe daher beim Laden Prüfungen durch, damit alle Daten, die geladen werden, auch wirklich so aussehen wie erwartet und nicht durch falsche Tabellen oder andere Daten etwas im Programm passiert, was nicht beabsichtigt ist. Die Start-Performance wird definitiv noch verbessert werden, für den Anfang ist mir ein stabileres Programm aber lieber als ein schnelles; schließlich geht es hier auch nur um den Programmstart, die Performance bei der Benutzung ist davon nicht betroffen.

Nicht zuletzt aber auch ein bereits an anderer Stelle erwähntes großes Dankeschön an euch, für eure Geduld und euer ganzes Feedback und weitere Hilfe, ohne die ich nicht all die Fehler hätte beheben können. Zwar haben es neue Regelwerke noch nicht in diese Version geschafft, und auch die nächste Version wird nicht alle neuen beinhalten, aber dennoch wird Optolith jetzt vergleichsweise schnell auf den aktuellen Stand der Regeln kommen können.

Aber nun zum Changelog dieser Version:

### Neue Features

- Helden können über die Heldenliste nun direkt gespeichert werden.
- Portraits von Helden und Begleitern können jetzt auch wieder gelöscht werden.

### Verbesserungen

- Auswahllisten werden nach aktivierten Regelwerken gefiltert. Das funktionierte vorher nur für die Hauptlisten wie Sonderfertigkeiten, jetzt aber eben auch für z. B. die Liste von Berufsgeheimnissen.
  - Wikieinträge können nicht nach bestimmten Regelwerken gefiltert werden; ebenso wenig wie diese bei geöffneten Helden nach den dort gewählten Regelwerken gefiltert werden. Dies wird noch nachgereicht!
- Fremdzauber werden jetzt wie untypische Vorteile durch eine rote Einfärbung markiert.
- Die Suche nach Professionen durchsucht jetzt auch Professionsvarianten.
- Auf dem Heldenbogen ist jetzt für doppelt so viele Sprachen Platz.
- Beim Hinzufügen von Vor-/Nachteilen werden jetzt sowohl die AP für Vorteile als auch für Nachteile angezeigt.
- Schilde werden auf dem Heldenbogen jetzt sowohl als Schild als auch als Waffe eingetragen.
- Texte des Wikis können jetzt selektiert und dadurch kopiert werden.
- Für die *Tradition (Gildenmagier)* muss jetzt ein Fremdzauber festgelegt werden. **Für eine bereits aktivierte SF funktioniert dies im *Regeln*-Tab! Bitte stellt dies ein, weil es für kommende Regelwerke relevant ist!**
- Um später besser auf Unterschiede von Versionen in verschiedenen Sprachen reagieren zu könne, wird zu den Helden ab jetzt auch die Sprache gespeichert, in der der Held erstellt wurde. **Für ältere Helden wird diese auf die aktuell eingestellte Sprache eingestellt. Zum Ändern müsst ihr in den *Regeln*-Tab wechseln! Bitte stellt dies ein, weil es in kommenden Versionen relevant wird!**
- Im Profil wird jetzt angezeigt, wie sich die zufällige Generierung für Gewicht und Größe zusammensetzt.
- Der Dialog, der beim Schließen auftaucht, wenn ungespeicherte Aktionen vorhanden sind, ist jetzt klarer formuliert und hat jetzt drei Buttons für alle drei Optionen.
- Text auf dem Heldenbogen kann jetzt selektiert werden. Diese Option ist aber nicht dazu geeignet, um den gesamten Heldenbogen zu kopieren, weil das Layout nicht richtig übernommen wird.
- Den FAQ wurde der Eintrag hinzugefügt, wie man LE/AE/KE hinzufügt.
- Wenn man den Wikieintrag für einen Eintrag außerhalb des Wikis angezeigen lässt, wird der Listeneintrag wie im Wiki hervorgehoben.
- Beim Pakt wird angezeigt, wenn Felder fehlen, die ausgefüllt werden müssen, um einen vollständigen Pakt zu erhalten.
- Die AP, die beim Beenden der Heldenerschaffung maximal übrig sein dürfen, betragen jetzt immer 10 AP, egal in welchem Modus man sich befindet.
- Einsatzmöglichkeiten für Talente hinzugefügt.
- Bei Talenten, bei denen die Einrechnung der Belastung nicht eindeutig ist, wird im Wikieintrag jetzt die komplette Beschreibung angezeigt, wann die Belastung relevant ist und wann nicht.
- Die einzelnen Einträge für Vorteil *Herausragender Sinn* und Nachteil *Eingeschränkter Sinn* wurden zusammengefügt.
- Unter *Ergänzende Quellen* werden in Wikieinträgen von Vorteilen, Nachteilen und Sonderfertigkeiten jetzt die Quellen genannt, von denen die jeweiligen Einträge ihre Auswahlmöglichkeiten bekommen. Z. B. wird bei Berufsgeheimnissen dann nicht nur die eigentliche SF aus dem Basisregelwerk als Quelle genannt, sondern eben auch die Quellen weiterer Berufsgeheimnisse auch anderen Büchern.
- Analog zur geweihten Variante des Rabenschnabels gibt es jetzt die im Regelwerk beschriebene profane Variante des Rabenschnabels zum dort genannten Preis von 90 S. Außer des Status *geweiht/nicht geweiht* unterscheiden sich die Gegenstände nicht.
- Die dargstellte Formel zur Berechnung der Astralenergie passt sich jetzt entsprechend der Tradition an. Denn bei einigen Traditionen fließt nur die Hälfte der Leiteigenschaft ein und einige haben keine Leiteigenschaft, die einfließen könnte.
- Bei Stabzaubern wird *Bindung des Stabes* als Voraussetzung ausgeblendet.

### Fehlerbehebungen

- Nach einem Wechsel von Deutsch zu Englisch konnten Charaktere nicht mehr bearbeitet werden.
- Sonderfertigkeiten können wieder nach Gruppen sortiert werden.
- Verbreitung von Liturgien wird jetzt alphabetisch sortiert.
- Fertigkeits- und Kampftechnik-Maxima werden bei der Erstellung nun auch von den Probeneigenschaften bzw. Leiteigenschaften beeinflusst.
- Hesindegeweihter: Sternkunde 4 anstelle von Alchimie 4.
- FAQ: Zwei Typos korrigiert.
- *Meistertalentierte* können keine Zauber mehr kaufen.
- Gelb hervorgehobene Vorteile/Nachteile werden jetzt auch in der Legende erklärt.
- Ein/e durch eine Professionsvariante entfernte/r Zauber/Liturgie der Basisprofession wird jetzt auch wirklich entfernt und nicht mehr auf FW 0 aktiviert.
- Fehlende Professionsvarianten für Profession *Wildniskundiger* hinzugefügt.
- Fehlende Berufsgeheimnisse aus dem **Aventurischen Kompendium I** hinzugefügt.
- Bilder werden auf Linux wieder angezeigt.
- Automatische Vorteile haben jetzt Kosten von 0 AP, sodass Spezieskosten wieder korrekt sind.
- Das Sortieren von Ausrüstung nach Gruppen wirft keinen Fehler mehr.
- Das Portrait von Begleitern wird nun beim Export auch mit exportiert.
- Details für Zauber und Liturgien werden wieder auf dem Heldenbogen angezeigt.
- *Intuitive Zauberer* haben keinen Zugriff mehr auf Rituale und Zauber des Steigerungsfaktors D.
- „Steigerungskosten“ → „Steigerungsfaktor“.
- Astralenergie wird beim *Gildenmagier aus Perricum* wieder richtig berechnet.
- Die Voraussetzung „Spezies, Kultur oder Profession muss \[...] als automatischen oder empfohlenen \[Vorteil/Nachteil] aufweisen“ berücksichtigt jetzt auch wieder automatische Vorteile der Spezies, sollten diese entfernt worden sein.
- Liturgiestile werden jetzt beim Charakterwechsel auch korrekt übernommen, sodass keine Zulassungen durch vorherige Stile mehr relevant sind.
- Begleiterlayout auf dem Heldenbogen ist jetzt wieder korrekt.
- Bei der PDF ist jetzt kein Scrollbalken mehr zu sehen.
- Ein valider Pakt wirft bei Sonderfertigkeiten keinen Fehler mehr.
- Bann-/Schutzkreise werden wieder auf dem Heldenbogen angezeigt.
- Beim Senken von Eigenschaften im Editor-Modus werden nun hinzugekaufte LE/AE/KE berücksichtigt und verhindern ggf. das Senken.
- *Intuitive Zauberer* behandeln jetzt alle Zauber als Zauber ihrer Tradition.
- Manchmal wurde im Wikieintrag von Professionen anstelle eines Wertes, z. B. bei *Ehrenhaftigkeit 6*, `null` angezeigt, sodass dort dann *Ehrenhaftigkeit null* stand.
- Manchmal wurde der im Wikieintrag angezeigte vorherige Wert von durch Professionsvarianten veränderte Wert um 6 erhöht. Beispiel Profession Ritter: *Etikette 2 statt 12* ist eigentlich *Etikette 2 statt 6*.
- Vorteil *Herausragende Fertigkeit* funktioniert jetzt auch wieder für Zauber.
- Vorteil *Koboldfreund* fehlte.
- Nachteil *Kleine Zauberauswahl* ist wieder für *Intuitive Zauberer* verfügbar.
- Nachteil *Lästige Blütenfeen* fehlte.
- Nachteil *Schlechte Eigenschaft (Geiz)* und *(Verschwendungssucht)* haben sich nicht ausgeschlossen.
- Im Eingabefeld für Nachteil *Prinzipientreue* steht jetzt „Prinzip“ und nicht mehr „Prinzipie“.
- Zauber und Liturgien sind jetzt nicht mehr im Nachteil *Unfähig* enthalten. Bei Helden, die dies hatten, wird der Nachteil automatisch entfernt.
- Das Kaufen des Nachteils *Wenige Visionen* wirft keinen Fehler mehr.
- SF *Adaption (Zauber)* wird jetzt angezeigt, wenn die Voraussetzungen erfüllt sind.
- SF *Adaption (Zauber)* exkludiert jetzt Fremdzauber.
- SF *Aspektkenntnis* kann wieder problemlos hinzugefügt werden.
- SF *Astralraub*: Leerzeichen fehlte.
- SF *Böser Namensvetter*, *Lächerlicher Name*, *Schurkenname*, *Unpassender Name*: Nicht mehr als Elf wählbar.
- SF *Böser Namensvetter*: Formatierung korrigiert.
- SF *Buchdrucker*: Voraussetzung Stoffbearbeitung 4 → Mechanik 4.
- SF *Eisenhagel* kann wieder gekauft werden.
- SF *Gebieter des \[Aspekts\]* wird jetzt wieder angezeigt, wenn die Voraussetzungen dafür erfüllt werden.
- SF *Kupferstich*: Voraussetzung Lebensmittelbearbeitung 4 → Malen & Zeichen 4.
- SF *Macht der Namenlosen Klinge* ist jetzt wieder in allen 13 Stufen auswählbar, natürlich vorausgesetzt, dass die Voraussetzungen erfüllt sind.
- SF *Merkmalskenntnis* kann wieder problemlos hinzugefügt werden.
- SF *Präziser Schuss/Wurf* hatte falsche Eigenschaftsvoraussetzungen.
- SF *Scharfschütze II*: Voraussetzung ist jetzt IN 17 statt IN 15.
- SF *Siegelbrecher*: Merkmal Hellsicht → Merkmal Antimagie.
- SF *Verschwinde!*: AsP-Kosten und Volumen ergänzt.
- Die Nachteile *Keine Flugsalbe* und *Kein Vertrauter* verringern nun korrekt die Kosten der SF *Tradition (Hexen)*.
- SF *Tradition (Gildenmagier)* wird jetzt bei der Fremdzauberbegrenzung berücksichtigt (siehe dazu auch die Änderung an der Tradition weiter oben).
- SF *Volumenerweiterung des Bannschwerts*: AsP-Kosten ergänzt.
- *Bekehren & Überzeugen*: Probe MU/IN/CH → MU/KL/CH.
- *Etikette*, Belastung: Evtl. → Nein.
- *Fahrzeuge*: Unter **Werkzeuge** fehlte *Fahrzeug*.
- *Tanzen*, misslungene Probe: Vorher war dort der Text von *Sinnesschärfe*.
- *Verkleiden*, Belastung: Evtl. → Ja.
- Falsche Probeneigenschaften von Zaubern/Magischen Handlungen:
  - *Friedenslied*: MU/KL/IN → MU/IN/CH
  - *Sorgenlied*: MU/CH/CH → MU/IN/IN
  - *Zaubermelodie*: MU/KL/CH → MU/IN/CH
- Text, dass ein bestimmter Aspekt eines Zaubers nicht modifiziert werden kann, fehlt:
  - MOTORICUS: Kosten
  - MOVIMENTO: Wirkungsdauer
  - NEBELWAND: Kosten
- Fehlende Probenmodifikatoren (SK/ZK) bei Zaubern hinzugefügt.
- ADLERAUGE: Tradition Druiden ergänzt, AMA1-Quelle ergänzt.
- ANALYS ARKANSTRUKTUR: Zauberdauer 2 Aktionen → 32 Aktionen.
- ATTRIBUTO für Mut, Fingerfertigkeit, Gewandheit und Konstitution beinhaltet nun auch die Wirkungen der einzelnen QS.
- BAND UND FESSEL – Zaubererweiterungen: Wortdopplung korrigiert.
- DUNKELHEIT – Zaubererweiterungen: Leerzeichen fehlten.
- FULMINICTUS – Zaubererweiterungen: Name korrigiert und Voraussetzungen angepasst.
- KARNIFILO hieß vorher Kanifilo.
- KLARUM PURUM, Kosten: 8 AsP.
- KRABBELNDER SCHRECKEN – *Starker Ekel*: Typo korrigiert.
- MANUS MIRACULA – Zaubererweiterungen: Name korrigiert und Voraussetzungen angepasst.
- PHYSIOSTABILIS: Effekttext ist wieder korrekt.
- SCHWARZER SCHRECKEN, Kosten: 8 AsP → 4 AsP.
- UNBERÜHRT VON SATINAV: Merkmal Objekt → Merkmal Temporal.
- WIRBELFORM verhält sich jetzt vollständig wie der Eintrag aus **Aventurische Magie II**.
- XENOGRAPHUS – *Besseres Sprachverständnis* hieß vorher *Längere Wirkungsdauer*.
- ZAUBERKLINGE GEISTERSPEER – Zaubererweiterungen: Formatierung korrigiert.
- *Melodie des Magieschadens* war nicht durch Ceoladir wählbar.
- *Melodie der Zähigkeit*: Formatierung korrigiert.
- *Melodie des Zögerns* war nicht durch Derwisch wählbar, konnte aber durch Sangara gewählt werden.
- Herrschaftsrituale sind nun enthalten.
- Falsche Probeneigenschaften von Liturgien:
  - *Kleiner Bannstrahl*: MU/KL/CH → MU/IN/CH
  - *Ehrenhaftigkeit*: MU/KL/CH → MU/IN/CH
  - *Ermutigung*: MU/KL/CH → MU/IN/CH
  - *Friedvolle Aura*: MU/KL/CH → MU/IN/CH
  - *Wasserlauf*: MU/KL/IN → MU/IN/GE
- Text, dass ein bestimmter Aspekt einer Liturgie nicht modifiziert werden kann, fehlt:
  - *Bann der göttlichen Gaben*: Liturgiedauer
  - *Dämonenwall*: Kosten
  - *Liturgieschild*: Kosten
  - *Mächtiger Angriff*: Kosten
  - *Magiebann*: Liturgiedauer
  - *Magiespiegel*: Kosten
  - *Motivation*: Kosten
  - *Namenlose Kälte*: Kosten
- *Ächtung (Exkommunikation)* – Liturgieerweiterungen: Buchname bei der Seitenangabe ergänzt.
- *Blitzschlag*: Verbreitung *Boron (Tod)* statt *Rondra (Sturm)*.
- *Delphingestalt*: Effekttext korrigiert.
- *Häutung* und *Häutung* – Liturgieerweiterungen: Leerzeichen fehlte.
- *Guter Fang*: Liturgie → Zeremonie.
- *Guter Fang* – Liturgieerweiterungen: Formatierung korrigiert.
- *Klarer Geist*: Aspekt *Bildung* entfernt.
- *Namenlose Zweifel*: Effekttext korrigiert.
- *Namenloses Vergessen*: Effekttext korrigiert.
- *Nebelschwaden*: Effekttext korrigiert.
- *Obsession* fehlte.
- *Opfergang*: Typo korrigiert.
- *Pech und Schwefel*: Effekttext vervollständigt.
- *Ruf der Heimat*: Effekttext vervollständigt.
- *Seevogelsprache* – Mehr Vögel: Leerzeichen eingefügt.
- *Sicherer Weg*: Leerzeichen eingefügt.
- *Traumbild*, Effekt: Leerzeichen fehlte.
- *Traumbild* – Liturgieerweiterungen: Formatierung korrigiert.
- *Verblassende Erinnerung*: Falsche Verbreitung.
- *Verblassende Erinnerung* – Liturgieerweiterungen: Formatierung korrigiert.
- *Wasserlauf*: Verbreitung *Allgemein* hinzugefügt, Effekttext korrigiert.
- *Windruf*, Zielkategorie: Objekt (profane Objekte, Segel).
- *Zähe Haut*: Aspekt *Gutes Gold* hinzugefügt.
- *Albernische Bauernwehr*: Wort fehlte.
- *Albernisches Entermesser*: Typo behoben.
- *Amazonensäbel* fehlte.
- *Andergaster*: Formatierung des Waffenvorteils korrigiert.
- *Dietrichset* hat jetzt auch Preis und Gewicht.
- *Faustschild*: Formatierung korrigiert.
- *Gänsebeutel*: Preis korrigiert.
- *Gaoraith*: Länge fehlte.
- *Hakendolch*: Vorteil und Nachteil ergänzt.
- *Handspiegel* zeigt jetzt die dazugehörige Regeltechnik.
- *Harbener Säbel*, Länge: 100 HF → 75 HF.
- *Havener Messer*: Formatierung korrigiert.
- *Hunde-, Pony, Pferdefutter*: Gewicht entfernt.
- *Kettenhemd*: Formatierung angepasst.
- *Kletterseil* hat jetzt korrekte Kosten.
- *Korspieß*: Formatierung korrigiert.
- Der Waffennachteil des *Langbogens* war unvollständig.
- *Neckerdreizack*: Typo behoben.
- *Pergament, gutes, 1 Blatt*: Preis korrigiert.
- *Richtschwert* war nicht als Waffe gruppiert.
- *Seesäbel*: Formatierung korrigiert und fehlendes Wort ergänzt.
- *Sense* war keine improvisierte Waffe mit einem Gewicht von 3,5 Stn.
- Kosten und Gewicht für *Seidenseil* ergänzt.
- *Spealleagh* war nicht als Waffe eingetragen.
- *Streitkolben der Streitenden Königreiche* fehlte.
- *Stockdegen*: Formatierung angepasst.
- *Sturmsense*: Formatierung angepasst.
- *Turnierrüstung*: Formatierung angepasst.
- *Turnierzweihänder*: Leiteigenschaften angepasst.
- *Wurfnetz*: Formatierung korrigiert.
- *Zugvogelfedern*: Preis korrigiert.
