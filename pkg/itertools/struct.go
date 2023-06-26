package itertools

import "sync"

type Iterator struct {
	Mutex  *sync.Mutex
	Locked []string
	List   []string
	I      int
}
