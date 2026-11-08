import { createCn } from "cn/config";

export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "caption",
            "label",
            "body",
            "title",
            "heading",
            "display",
            "code",
          ],
        },
      ],
    },
  },
});
