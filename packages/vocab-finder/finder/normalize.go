package finder

import (
	"encoding/json"

	"github.com/ikawaha/kagome/v2/tokenizer"
)

type VContent struct {
	Token tokenizer.TokenData
	Count int
}

func Normalize(s string) map[string]VContent {
	out := map[string]VContent{}

	tokens := Tokenizer.Tokenize(s)

	for _, token := range tokens {
		_, exists := token.BaseForm()

		d := tokenizer.NewTokenData(token)

		// if d.Class == tokenizer.UNKNOWN.String() {
		// 	continue
		// }

		if func() bool {
			for _, v := range token.POS() {
				if v == "記号" || v == "助詞" {
					return true
				}
			}
			return false
		}() {
			continue
		}

		if exists {
			d.Surface = ""
		}

		d.Start = 0
		d.End = 0
		d.ID = 0

		b, _ := json.Marshal(d)
		id := string(b)
		c := out[id]

		if c.Token.Class == "" {
			out[id] = VContent{
				Token: d,
				Count: 1,
			}
		} else {
			c.Count += 1
			out[id] = c
		}
	}

	return out
}
