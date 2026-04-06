# Optolith Character Generator and Manager [![Build Status](https://travis-ci.com/elyukai/optolith-client.svg?branch=develop)](https://travis-ci.com/elyukai/optolith-client)

Welcome to the repository for Optolith, a desktop application for The Dark Eye 5th Edition. Nice to see you here! 👋🏻

> [!CAUTION]
> This is the branch of the upcoming V2 version. This is **not production-ready**. If you need access to the V1 line of releases, check out the `develop-V1` branch.
>
> Note that the self-building constraints below also apply to the V1.

## Install

You can download the app [here (German page)](http://www.ulisses-ebooks.de/product/209711) or here [here (English page)](http://www.drivethrurpg.com/product/220253) (same app on both pages). You'll get an installer for Windows with Auto Update support and a DMG for Mac. For Linux, you get an AppImage, which _should_ support Auto Update but it doesnt seem to work currently. You also get a tar.gz if you don't like AppImage.

It is available for Windows 7+ as well as for Linux (Ubuntu 12.04+, Fedora 21, Debian 8) and macOS 10.9+ x64.

### Self-Building and Package Registries

Please note that self-building is only possible in a restricted way, as the underlying database is private due to licensing reasons. You can follow the in the [Contributing Guide](CONTRIBUTING.md) to obtain a version of the database from an already existing release. Please note that due to these licensing restrictions distribution via package managers like `brew` or `apt`

## Goal

Optolith was built and is developed based on a few key criteria:

- A player should be able to create characters without additional cost.
- A player should take care of the more important parts of a character &ndash; the personality and background &ndash; instead of keeping track of prerequisites and AP.
- Creating a character should be as easy and as intuitive as possible to focus on the actual stats.

With those criteria in mind, we further enhance the app.

## Contributing

Info on reporting bugs, getting help, contributing code and more can be found in the [Contributing Guide](CONTRIBUTING.md)!

## License

[MPL 2.0](LICENSE)
