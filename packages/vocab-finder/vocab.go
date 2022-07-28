package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"path"
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

func ListVocabFile(infile string, outfile string) {
	b, e := ioutil.ReadFile(infile)
	if e != nil {
		log.Fatalln(e)
	}

	out := ListVocab(string(b))

	if outfile != "" {
		e := ioutil.WriteFile(outfile, []byte(out), 0x644)
		if e != nil {
			log.Fatalln(e)
		}
	} else {
		fmt.Println(out)
	}
}

func ListVocabDir(infolder string, outfile string) {
	s := ""
	files, e := ioutil.ReadDir(infolder)
	if e != nil {
		log.Fatalln(e)
	}

	for _, f := range files {
		filename := f.Name()
		if f.IsDir() {
			continue
		}

		if !strings.HasSuffix(filename, ".srt") {
			continue
		}

		b, e := ioutil.ReadFile(path.Join(infolder, filename))
		if e != nil {
			log.Fatalln(e)
		}
		s += string(b) + "\n"
	}

	out := ListVocab(s)

	if outfile != "" {
		e := ioutil.WriteFile(outfile, []byte(out), 0x644)
		if e != nil {
			log.Fatalln(e)
		}
	} else {
		fmt.Println(out)
	}
}
