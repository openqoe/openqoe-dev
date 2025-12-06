#pragma once

#include <map>
#include <pistache/endpoint.h>
#include <pistache/router.h>
#include <string>

using namespace Pistache;

class ItemHandler
{
public:
  // Constructor declaration
  explicit ItemHandler(Address addr);

  // Initialization and Start methods
  void init(size_t threads = 2);
  void start();

private:
  std::shared_ptr<Http::Endpoint> httpEndpoint;
  Rest::Router router;

  // In-memory data storage
  std::map<int, std::string> items = {
      {1, "Item A"}, {2, "Item B"}, {3, "Item C"}};

  // Route setup method
  void setupRoutes();

  // CRUD Handler declarations
  void getItem(const Rest::Request &request, Http::ResponseWriter response);
  void createItem(const Rest::Request &request, Http::ResponseWriter response);
  void updateItem(const Rest::Request &request, Http::ResponseWriter response);
  void deleteItem(const Rest::Request &request, Http::ResponseWriter response);
};
