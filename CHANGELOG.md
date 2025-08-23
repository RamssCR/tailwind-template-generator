# Changelog

All notable updates of this library will be documented on this file.

This format is based on [Keep a Changelog](https://keepachangelog.com/1.0.0/)
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-08-23
### Added
- Added YAML as another colors source to generate the CSS file.
- Added a `sample.yaml` file to provide an example of what that the YAML structure must be like.
- Updated the `README` file with the respective new integrations.

## [1.0.1] - 2025-08-21
### Fixed
- Corrected optional objects in the css schema.
- Added validation if `dark` colors exist not to insert an empty `.dark` css selector.
- Expanded `sample.json` with an optional `tertiary` color block.