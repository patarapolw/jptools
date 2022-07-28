package main

import (
	"context"

	kagome "github.com/ikawaha/kagome/v2/cmd/server"
)

func Server() {
	ctx := context.Background()
	kagome.Run(ctx, []string{})
}
