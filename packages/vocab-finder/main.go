package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"
)

func main() {
	dir := "M:\\Downloads\\DEATH.NOTE.-デスノート-(netflix)"

	outfile := ""
	outIndex := 1

	if len(os.Args) > outIndex {
		outfile = os.Args[outIndex]
	}

	var e error

	s := ""
	files, e := ioutil.ReadDir(dir)
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

		b, e := ioutil.ReadFile(path.Join(dir, filename))
		if e != nil {
			log.Fatalln(e)
		}
		s += string(b) + "\n"
	}

	fmt.Println(len(strings.Split(s, "\n")))

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
