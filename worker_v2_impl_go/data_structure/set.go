package datastructure

// Set represents a collection of unique elements.
type Set[T comparable] struct {
	m map[T]struct{}
}

// NewSet initializes a new set with the given elements.
func NewSet[T comparable](items ...T) *Set[T] {
	s := &Set[T]{
		m: make(map[T]struct{}),
	}
	s.Add(items...)
	return s
}

// Add inserts elements into the set.
func (s *Set[T]) Add(items ...T) {
	for _, item := range items {
		s.m[item] = struct{}{}
	}
}

// Remove deletes an element from the set.
func (s *Set[T]) Remove(item T) {
	delete(s.m, item)
}

// Contains checks if an element is present in the set.
func (s *Set[T]) Contains(item T) bool {
	_, found := s.m[item]
	return found
}

// Size returns the number of elements in the set.
func (s *Set[T]) Size() int {
	return len(s.m)
}

func (s *Set[T]) Items() []T {
	items := make([]T, 0, len(s.m))
	for item := range s.m {
		items = append(items, item)
	}
	return items
}

func (s *Set[T]) Clear() {
	s.m = make(map[T]struct{})
}
