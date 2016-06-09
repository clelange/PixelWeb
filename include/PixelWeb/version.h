#ifndef _pixel_web_PixelWeb_version_h_
#define _pixel_web_PixelWeb_version_h_

#include <string>

#include "config/PackageInfo.h"

// !!! Edit these lines to reflect the latest package version. !!!
#define PIXELWEB_VERSION_MAJOR 1
#define PIXELWEB_VERSION_MINOR 0
#define PIXELWEB_VERSION_PATCH 0

// If any previous versions available:
// #define PIXELWEB_PREVIOUS_VERSIONS "3.8.0,3.8.1"
// else:
#undef PIXELWEB_PREVIOUS_VERSIONS

//
// Template macros and boilerplate code.
//
#define PIXELWEB_VERSION_CODE PACKAGE_VERSION_CODE(PIXELWEB_VERSION_MAJOR,PIXELWEB_VERSION_MINOR,PIXELWEB_VERSION_PATCH)
#ifndef PIXELWEB_PREVIOUS_VERSIONS
#define PIXELWEB_FULL_VERSION_LIST PACKAGE_VERSION_STRING(PIXELWEB_VERSION_MAJOR,PIXELWEB_VERSION_MINOR,PIXELWEB_VERSION_PATCH)
#else
#define PIXELWEB_FULL_VERSION_LIST PIXELWEB_PREVIOUS_VERSIONS "," PACKAGE_VERSION_STRING(PIXELWEB_VERSION_MAJOR,PIXELWEB_VERSION_MINOR,PIXELWEB_VERSION_PATCH)
#endif

namespace pixel {
  namespace web {
    const std::string package = "PixelWeb";
    const std::string versions = PIXELWEB_FULL_VERSION_LIST;
    const std::string description = "Pixel XDAQ web package containing javascript and CSS files.";
    const std::string authors = "Clemens Lange";
    const std::string summary = "Pixel web utilities for pixel";
    const std::string link = "https://twiki.cern.ch/twiki/bin/view/CMS/PixelOnlineSoftwareDevelopment";
    config::PackageInfo getPackageInfo();
    void checkPackageDependencies();
    std::set<std::string, std::less<std::string> > getPackageDependencies();
} // namespace web
} // namespace pixel

#endif // _pixel_web_PixelWeb_version_h_
