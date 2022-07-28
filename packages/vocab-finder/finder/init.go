package finder

import (
	"log"

	"github.com/ikawaha/kagome-dict/ipa"
	"github.com/ikawaha/kagome/v2/tokenizer"
)

var Tokenizer *tokenizer.Tokenizer

func init() {
	t, err := tokenizer.New(ipa.Dict(), tokenizer.Nop())
	if err != nil {
		log.Fatal(err)
	}
	Tokenizer = t
}
