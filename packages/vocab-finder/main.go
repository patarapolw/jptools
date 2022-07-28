package main

import (
	"context"

	kagome "github.com/ikawaha/kagome/v2/cmd/server"
)

func main() {
	ctx := context.Background()
	kagome.Run(ctx, []string{})
}
