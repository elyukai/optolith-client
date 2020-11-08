## 1.4.2

### Améliorations

- Suppression des *N/D* dans les tableaux des sorts et des liturgies sur la feuille de personnage afin que les valeurs puissent être ajoutées à la main. [#747](https://github.com/elyukai/optolith-client/issues/747)
- Le démarrage était beaucoup plus lent qu'en 1.3.2. [#751](https://github.com/elyukai/optolith-client/issues/751)

### Bugs rectifiés

- La VTC maximale des techniques de combat pourrait être supérieure à celle autorisée par les règles. [#749](https://github.com/elyukai/optolith-client/issues/749)
- La marge supérieure des fenêtres superposées – comme lors de l'ajout d'avantages – était trop petite. [#727](https://github.com/elyukai/optolith-client/issues/727)
- Le bonus de dommages Q+SD n'était pas ajouté aux armes sans dommages fixes. [#737](https://github.com/elyukai/optolith-client/issues/737)
- La profession *Magicien blanc (Académie de Gareth de l'épée et du bâton)* des **règles de base** avait une mauvaise valeur de PAV et *Astronomie 4* au lieu de *l'Alchimie 4*. [#568](https://github.com/elyukai/optolith-client/issues/568)
- La zone de texte "compétences de la créature" sur l'export PDF était trop courte pour correspondre à toutes les compétences pertinentes d'une créature. [#733](https://github.com/elyukai/optolith-client/issues/733)
- Les images dont la fin de fichier était en majuscules n'étaient pas acceptées comme images de portrait. [#762](https://github.com/elyukai/optolith-client/issues/762)
- L'icône de téléchargement était affichée à la place de l'image du portrait sur la fiche de personnage si aucun portrait n'était défini. [#759](https://github.com/elyukai/optolith-client/issues/759)
- Sur Mac, si le fond papier était activé, des pages vierges supplémentaires étaient générées pour la sortie PDF. [#748](https://github.com/elyukai/optolith-client/issues/748)

### Remerciements

Enfin et surtout, un grand **merci** à tous ceux qui font des retours et donnent leur aide sur les différents canaux ainsi qu'aux personnes ci-dessous sur GitHub qui ont contribué à cette version !

- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

## 1.4.1

### Bugs rectifiés

- L'italien n'était pas disponible.

## 1.4.0

Veuillez vérifier les personnages pour lesquels vous avez ajouté la CS *intuition tactique* ou la CS *détection des embuscades*. Vous remarquerez qu'elle n'a pas son ancien nom. Ceci est dû à une erreur (mentionnée ci-dessous) où les noms de ces deux capacités spéciales ont été échangés. La représentation interne ne peut pas être modifiée et les entrées doivent donc être "renommées". Cela devrait également corriger les prérequis "incorrects" des deux entrées.

### Fonctionnalités

- Traduction italienne [#667](https://github.com/elyukai/optolith-client/issues/667) [#610](https://github.com/elyukai/optolith-client/issues/610)
- Fond de papier facultatif pour la feuille de personnages. [#36](https://github.com/elyukai/optolith-client/issues/36)
- Option de zoom de la vue sur la feuille de personnages. [#665](https://github.com/elyukai/optolith-client/issues/665)
- Ajouter/Soustraire de l'argent du porte-monnaie. [#666](https://github.com/elyukai/optolith-client/issues/666)
- Créez des avantages, des inconvénients et des capacités spéciales sur mesure avec un nom et une valeur en PAV (solution temporaire). [#632](https://github.com/elyukai/optolith-client/issues/632)

### Améliorations

- Le poids est maintenant indiqué dans une colonne spécifique dans l'onglet équipement. [#305](https://github.com/elyukai/optolith-client/issues/305)
- Les feuilles de combat inutiles ne sont plus utilisées, cela dépend maintenant de l'armure dont dispose le personnage. Par défaut, l'armure normale est utilisée si aucune armure n'est présente. [#407](https://github.com/elyukai/optolith-client/issues/407)
- Vous pouvez maintenant cliquer sur les noms des entrées pour afficher le texte de leurs règles. [#556](https://github.com/elyukai/optolith-client/issues/556)

### Bugs rectifiés

- Les variantes de la profession de *Prêtre de Boron* ont eu de mauvaises modifications de compétences. [#548](https://github.com/elyukai/optolith-client/issues/548)
- La profession *Magicien blanc (Epée & Bâton)* avait une valeur en PAV erronée et une modification de compétence supplémentaire. [#568](https://github.com/elyukai/optolith-client/issues/568)
- Les professions communes fixes d'une culture seront désormais affichées même si elles ne sont pas issues des **règles de base**. [#563](https://github.com/elyukai/optolith-client/issues/563)
- L'interface peut être réduite. [#487](https://github.com/elyukai/optolith-client/issues/487)
- Les armes de la technique de combat *Lances* n'étaient pas indiquées sur la fiche de personnage. [#662](https://github.com/elyukai/optolith-client/issues/662)
- Les valeurs d'attributs minimum étaient ignorées pour les valeurs de compétence élevées. Le maximum de la valeur de compétence est l'attribut lié le plus élevé&thinsp;+&thinsp;2, donc l'attribut le plus élevé doit avoir une valeur minimale de VC&thinsp;&minus;&thinsp;2. [#630](https://github.com/elyukai/optolith-client/issues/630)
- Les noms des CS *Intuition tactique* et *Détection des embuscades* ont été échangés. [#636](https://github.com/elyukai/optolith-client/issues/636)
- Le nouveau domaine d'application *Publications professionnelles* pour le talent *Droit* avait un prérequis de capacité spéciale erronée. [#680](https://github.com/elyukai/optolith-client/issues/680)
- Certains éléments de la liste étaient plus larges que la liste actuelle. [#683](https://github.com/elyukai/optolith-client/pull/683)
- Les en-têtes de liste n'étaient pas centrés par défaut. [#637](https://github.com/elyukai/optolith-client/issues/637)
- Les PV dépensés de façon permanente ne permettaient pas d'acheter des PV supplémentaires. [#606](https://github.com/elyukai/optolith-client/issues/606)
- On ne pouvait pas ajouter de PV supplémentaire si la CON est de 8 et que rien n'en dépend. [#694](https://github.com/elyukai/optolith-client/issues/694)
- La CS *Maîtrise de l'aspect* n'apparait pas même avec trois liturgies de VC 10 ou plus. [#591](https://github.com/elyukai/optolith-client/issues/591)
- La vérification des mises à jour et le bouton de vérification des mises à jour sont maintenant désactivés sur macOS, car les mises à jour ne sont pas possibles sur macOS actuellement. [#589](https://github.com/elyukai/optolith-client/issues/589)
- Techniques de combat mal applicables pour la CS *détection des embuscades*. [#658](https://github.com/elyukai/optolith-client/issues/658)
- Les alertes de mise à jour automatique étaient activées sur Linux même lorsqu'il n'y avait pas de mises à jour automatiques directes disponibles. [#573](https://github.com/elyukai/optolith-client/issues/573)
- Le dialogue de sauvegarde pour l'exportation d'un caractère en JSON n'a pas ajouté l'extension de fichier au nom de fichier suggéré. [#718](https://github.com/elyukai/optolith-client/issues/718)

### API

Il y a des changements importants et radicaux à venir avec la prochaine version, donc si vous utilisez la source Optolith ou enregistrez des données, je vous recommande de venir sur [Discord](https://discord.gg/wfdgB9g) afin que je puisse vous dire ce qui va être changé en détail. Puisque de plus en plus de personnes dépendent des données d'Optolith, je vais maintenant suivre strictement le versionnement sémantique afin que vous puissiez vous fier à la compatibilité des fichiers sources en vérifiant simplement le numéro de version. Il y aura un nouveau format pour les héros ainsi que pour les données sources. Vous pouvez également donner votre avis sur les changements, puisqu'ils ne sont pas encore complètement terminés &ndash; mais je pense qu'il serait quand même judicieux de vérifier les changements le plus tôt possible. La prochaine version majeure est encore un peu loin, vous aurez donc tout le temps d'ajuster votre logiciel.

### Remerciements

Enfin, un grand **merci** aux personnes suivantes sur GitHub qui ont contribué à cette publication !

- [Jonas (@Rahjenaos)](https://github.com/Rahjenaos)
- [Jordok (@Jordok)](https://github.com/Jordok)
- [JoveToo (@JoveToo)](https://github.com/JoveToo)
- [Lorenz Cuno Klopfenstein (@LorenzCK)](https://github.com/LorenzCK)
- [manuelstengelberger (@manuelstengelberger)](https://github.com/manuelstengelberger)
- [Philipp A. (@flying-sheep)](https://github.com/flying-sheep)
- [ZeSandman (@ZeSandman)](https://github.com/ZeSandman)

## 1.3.2

### Bugs rectifiés

- La description de la sélection des techniques de combat pour les variantes de professions n'est pas rendue correctement. #539
- Les professions ne tenaient pas compte des conditions prérequises. #507
- Le champ de texte "Titre" des données personnelles était mal renseigné. #492
- *Religion* avait une VC 6 pour la plupart des professions cléricales. #475
- Les États débordaient de la feuille de personnage en PDF mais pas dans Optolith. #473
- Le `config.json` a encore provoqué des erreurs pour de nombreux utilisateurs. Le problème devrait être réglé, finalement. #476
- Dans de très rares cas, des parties d'un fichier de héros ou la totalité d'un fichier de héros ont été effacées. C'est pour cette raison que la sauvegarde des héros a été complètement réécrite et condensée pour éviter d'autres problèmes. #477
- Rajout du dialecte Garethi manquant *Nostrien*. #480
- Rectification des licences tierces. #471
- Rectification des désavantages avec des options à choisir qui ne pouvaient pas être achetés. #470

### Known Issues

- Some of the entries with more complex prerequisites might *display* them wrong but *handle* them correct.

## 1.3.1

### Bugs rectifiés

- Dans la version française, vous ne pouviez pas créer de personnages, car vous ne pouviez choisir aucune publication, aucune race, ... #449
- Il y a eu une erreur due à des "clés inconnues" dans la configuration. #450
- Sur la feuille de personnage, les états n'étaient affichés dans une seule colonne que si le nombre d'états était pair. #448

## 1.3.0

Version initiale.
