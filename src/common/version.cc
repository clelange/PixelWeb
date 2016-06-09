#include "PixelWeb/version.h"

#include "config/version.h"
#include "xdaq/version.h"
#include "xgi/version.h"

GETPACKAGEINFO(pixel::web)

void
pixel::web::checkPackageDependencies()
{
  CHECKDEPENDENCY(config);
  CHECKDEPENDENCY(xdaq);
  CHECKDEPENDENCY(xgi);
}

std::set<std::string, std::less<std::string> >
pixel::web::getPackageDependencies()
{
  std::set<std::string, std::less<std::string> > dependencies;

  ADDDEPENDENCY(dependencies, config);
  ADDDEPENDENCY(dependencies, xdaq);
  ADDDEPENDENCY(dependencies, xgi);

  return dependencies;
}
