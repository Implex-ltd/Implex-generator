package itertools

import (
	"errors"
	"math/rand"
	"sync"
	"time"
)

func NewIterator(items []string) *Iterator {
	rand.New(rand.NewSource(time.Now().UnixNano()))

	return &Iterator{
		Mutex: &sync.Mutex{},
		List:  items,
	}
}

func (i *Iterator) RandomiseIndex() error {
	if len(i.List) <2 {
		return errors.New("there is not enought items in iterator")
	}

	i.I = rand.Intn(len(i.List)-1) + 1
	
	return nil
}

func (i *Iterator) IsLocked(Element string) bool {
	for _, v := range i.Locked {
		if Element == v {
			return true
		}
	}
	return false
}

func (i *Iterator) Next() string {
	i.Mutex.Lock()
	defer i.Mutex.Unlock()

	for {
		i.I++
		if i.I >= len(i.List) {
			i.I = 0
		}

		if !i.IsLocked(i.List[i.I]) {
			return i.List[i.I]
		}

		time.Sleep(time.Millisecond)
	}
}

func (i *Iterator) IsInList(Element string) bool {
	for _, v := range i.List {
		if Element == v {
			return true
		}
	}
	return false
}

func (i *Iterator) Lock(Element string) {
	i.Mutex.Lock()
	defer i.Mutex.Unlock()

	if i.IsInList(Element) {
		i.Locked = append(i.Locked, Element)
	}
}

func (i *Iterator) Unlock(Element string) {
	i.Mutex.Lock()
	defer i.Mutex.Unlock()

	for ii, v := range i.Locked {
		if Element == v {
			i.Locked = append(i.Locked[:ii], i.Locked[ii+1:]...)
		}
	}
}

func (i *Iterator) LockByTimeout(Element string, Timeout time.Duration) {
	defer i.Unlock(Element)

	if i.IsLocked(Element) {
		i.Unlock(Element)
	}

	i.Lock(Element)
	time.Sleep(Timeout)
}
