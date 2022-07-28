package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"sort"

	"github.com/patarapolw/jptools/packages/vocab-finder/finder"
)

func main() {
	content, err := ioutil.ReadFile(os.Args[1])

	if err != nil {
		log.Fatal(err)
	}

	tokens := finder.Normalize(string(content))

	keys := make([]string, 0, len(tokens))

	for id, token := range tokens {
		if token.Count > 1 {
			keys = append(keys, id)
		}
	}

	sort.SliceStable(keys, func(i, j int) bool {
		return tokens[keys[j]].Count-tokens[keys[i]].Count > 0
	})

	for _, id := range keys {
		fmt.Printf("%s\t%d\n", id, tokens[id].Count)
	}
}
