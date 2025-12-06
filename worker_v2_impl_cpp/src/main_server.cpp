#include "./item_handler.hpp"
#include <iostream>

using namespace Pistache;

int main() {
  // Define the address and port
  Address addr(Ipv4::any(), Port(8786));

  // Determine thread count
  size_t threads = std::thread::hardware_concurrency();

  std::cout << "Pistache server starting on port 8786 with " << threads
            << " threads." << std::endl;

  try {
    // Instantiate the handler
    ItemHandler handler(addr);

    // Initialize and start the server
    handler.init(threads);
    handler.start();
  } catch (const std::exception &e) {
    std::cerr << "Server error: " << e.what() << std::endl;
    return 1;
  }

  return 0;
}
