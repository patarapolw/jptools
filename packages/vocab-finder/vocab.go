package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/patarapolw/jptools/packages/vocab-finder/finder"
)

func ListVocab(s string) string {
	tokens := finder.Normalize(s)
	keys := make([]string, 0, len(tokens))

	for id, token := range tokens {
		if token.Count > 1 {
			keys = append(keys, id)
		}
	}

	sort.SliceStable(keys, func(i, j int) bool {
		return tokens[keys[j]].Count-tokens[keys[i]].Count > 0
	})

	out := []string{}
	for _, id := range keys {
		t := tokens[id]

		out = append(out, strings.Join([]string{
			t.Token.BaseForm,
			t.Token.Reading,
			t.Token.Pronunciation,
			strings.Join(t.Token.POS, " "),
			strconv.Itoa(t.Count),
		}, "\t"))
	}

	return strings.Join(out, "\n")
}

func ListVocabFile() {
	filename := os.Args[1]
	output := ""

	if len(os.Args) > 2 {
		output = os.Args[2]
	}

	b, e := ioutil.ReadFile(filename)
	if e != nil {
		log.Fatalln(e)
	}

	out := ListVocab(string(b))

	if output != "" {
		e := ioutil.WriteFile(output, []byte(out), 0x644)
		if e != nil {
			log.Fatalln(e)
		}
	} else {
		fmt.Println(out)
	}
}
