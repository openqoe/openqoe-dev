#include "./item_handler.hpp"

using namespace Pistache;
using namespace std;

// --- Class Implementation ---

ItemHandler::ItemHandler(Address addr)
    : httpEndpoint(std::make_shared<Http::Endpoint>(addr)) {
  // Constructor initializes the Http::Endpoint
}

void ItemHandler::init(size_t threads) {
  auto opts = Http::Endpoint::options().threads(threads);
  httpEndpoint->init(opts);
  setupRoutes();
}

void ItemHandler::start() {
  httpEndpoint->setHandler(router.handler());
  httpEndpoint->serve();
}

void ItemHandler::setupRoutes() {
  using namespace Rest;

  // Use Routes::bind to connect the router to the class methods
  Routes::Get(router, "/api/items/:id",
              Routes::bind(&ItemHandler::getItem, this));
  Routes::Post(router, "/api/items",
               Routes::bind(&ItemHandler::createItem, this));
  Routes::Put(router, "/api/items/:id",
              Routes::bind(&ItemHandler::updateItem, this));
  Routes::Delete(router, "/api/items/:id",
                 Routes::bind(&ItemHandler::deleteItem, this));
}

// --- CRUD Method Implementations (same as before) ---

void ItemHandler::getItem(const Rest::Request &request,
                          Http::ResponseWriter response) {
  auto idStr = request.param(":id").as<std::string>();
  int id = std::stoi(idStr);

  if (items.count(id)) {
    std::string content =
        "{\"id\": " + idStr + ", \"name\": \"" + items[id] + "\"}";
    response.send(Http::Code::Ok, content, MIME(Application, Json));
  } else {
    response.send(Http::Code::Not_Found, "Item not found");
  }
}

void ItemHandler::createItem(const Rest::Request &request,
                             Http::ResponseWriter response) {
  std::string newName = request.body();
  if (newName.empty()) {
    response.send(Http::Code::Bad_Request, "Missing item name in body");
    return;
  }

  int newId = 0;
  for (const auto &pair : items) {
    if (pair.first > newId)
      newId = pair.first;
  }
  newId++;

  items[newId] = newName;
  std::string content = "Created new item: {\"id\": " + std::to_string(newId) +
                        ", \"name\": \"" + newName + "\"}";

  response.send(Http::Code::Created, content, MIME(Application, Json));
}

void ItemHandler::updateItem(const Rest::Request &request,
                             Http::ResponseWriter response) {
  auto idStr = request.param(":id").as<std::string>();
  int id = std::stoi(idStr);
  std::string newName = request.body();

  if (items.count(id)) {
    items[id] = newName;
    response.send(Http::Code::Ok, "Item " + idStr + " updated to: " + newName);
  } else {
    response.send(Http::Code::Not_Found, "Cannot update: Item not found");
  }
}

void ItemHandler::deleteItem(const Rest::Request &request,
                             Http::ResponseWriter response) {
  auto idStr = request.param(":id").as<std::string>();
  int id = std::stoi(idStr);

  if (items.count(id)) {
    items.erase(id);
    response.send(Http::Code::No_Content, "Item " + idStr + " deleted");
  } else {
    response.send(Http::Code::Not_Found, "Cannot delete: Item not found");
  }
}
