import * as React from "react";
import { currentVersion } from "../../Utilities/Raw/compatibilityUtils";
import { Page } from "../Universal/Page";
import { Scroll } from "../Universal/Scroll";

const Separator = () => (
  <p>
    ----------------------------------------------------------------------
  </p>
)

const MITLicense = () => (
  <>
    <p>
      Permission is hereby granted, free of charge, to any person obtaining
      a copy of this software and associated documentation files
      (the "Software"), to deal in the Software without restriction,
      including without limitation the rights to use, copy, modify, merge,
      publish, distribute, sublicense, and/or sell copies of the Software,
      and to permit persons to whom the Software is furnished to do so,
      subject to the following conditions:
    </p>
    <p>
      The above copyright notice and this permission notice shall be
      included in all copies or substantial portions of the Software.
    </p>
    <p>
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
      MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
      IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
      CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
      TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
      SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    </p>
  </>
)

export const ThirdPartyLicenses = () => (
  <Page id="third-party-software">
    <Scroll className="text">
      <h2>Optolith Desktop Client v{currentVersion}</h2>
      Third Party Software and Content Licenses
      <div className="third-party-software-body">
        <p>
          This product was created under a license. Das Schwarze Auge and its
          logo as well as Aventuria, Dere, Myranor, Riesland, Tharun and Uthuria
          and their logos are trademarks of Significant GbR. The title and
          contents of this book are protected under the copyright laws of the
          United States of America. No part of this publication may be
          reproduced, stored in retrieval systems or transmitted, in any form or
          by any means, whether electronic, mechanical, photocopy, recording, or
          otherwise, without prior written consent by Ulisses Spiele GmbH,
          Waldems.
        </p>
        <p>
          This publication includes material that is protected under copyright
          laws by Ulisses Spiele and/or other authors. Such material is used
          under the Community Content Agreement for the SCRIPTORIUM AVENTURIS.
        </p>
        <p>
          This publication includes material that is protected under copyright
          laws by Ulisses Spiele and/or other authors. Such material is used
          under the Community Content Agreement for the SCRIPTORIUM AVENTURIS.
        </p>
        <p>
          All other original materials in this work is copyright 2017-present by
          Lukas Obermann and published under the Community Content Agreement for
          the SCRIPTORIUM AVENTURIS.
        </p>
        <Separator />
        <p>
          Alegreya font<br/>
          Copyright (c) 2011, Juan Pablo del Peral (juan@huertatipografica.com.ar),<br/>
          with Reserved Font Names "Alegreya" "Alegreya SC"<br/>
        </p>
        <p>
          This Font Software is licensed under the SIL Open Font License, Version 1.1.<br/>
          This license is copied below, and is also available with a FAQ at:
          http://scripts.sil.org/OFL
        </p>
        <p>
          --------------------<br/>
          SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007<br/>
          --------------------
        </p>
        <p>
          PREAMBLE<br/>
          The goals of the Open Font License (OFL) are to stimulate worldwide
          development of collaborative font projects, to support the font
          creation efforts of academic and linguistic communities, and to
          provide a free and open framework in which fonts may be shared and
          improved in partnership with others.
        </p>
        <p>
          The OFL allows the licensed fonts to be used, studied, modified and
          redistributed freely as long as they are not sold by themselves. The
          fonts, including any derivative works, can be bundled, embedded,
          redistributed and/or sold with any software provided that any reserved
          names are not used by derivative works. The fonts and derivatives,
          however, cannot be released under any other type of license. The
          requirement for fonts to remain under this license does not apply to
          any document created using the fonts or their derivatives.
        </p>
        <p>
          DEFINITIONS<br/>
          "Font Software" refers to the set of files released by the Copyright
          Holder(s) under this license and clearly marked as such. This may
          include source files, build scripts and documentation.
        </p>
        <p>
          "Reserved Font Name" refers to any names specified as such after the
          copyright statement(s).
        </p>
        <p>
          "Original Version" refers to the collection of Font Software
          components as distributed by the Copyright Holder(s).
        </p>
        <p>
          "Modified Version" refers to any derivative made by adding to,
          deleting, or substituting -- in part or in whole -- any of the
          components of the Original Version, by changing formats or by porting
          the Font Software to a new environment.
        </p>
        <p>
          "Author" refers to any designer, engineer, programmer, technical
          writer or other person who contributed to the Font Software.
        </p>
        <p>
          PERMISSION &amp CONDITIONS<br/>
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of the Font Software, to use, study, copy, merge, embed,
          modify, redistribute, and sell modified and unmodified copies of the
          Font Software, subject to the following conditions:
        </p>
        <p>
          1) Neither the Font Software nor any of its individual components, in
          Original or Modified Versions, may be sold by itself.
        </p>
        <p>
          2) Original or Modified Versions of the Font Software may be bundled,
          redistributed and/or sold with any software, provided that each copy
          contains the above copyright notice and this license. These can be
          included either as stand-alone text files, human-readable headers or
          in the appropriate machine-readable metadata fields within text or
          binary files as long as those fields can be easily viewed by the user.
        </p>
        <p>
          3) No Modified Version of the Font Software may use the Reserved Font
          Name(s) unless explicit written permission is granted by the
          corresponding Copyright Holder. This restriction only applies to the
          primary font name as presented to the users.
        </p>
        <p>
          4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
          Software shall not be used to promote, endorse or advertise any
          Modified Version, except to acknowledge the contribution(s) of the
          Copyright Holder(s) and the Author(s) or with their explicit written
          permission.
        </p>
        <p>
          5) The Font Software, modified or unmodified, in part or in whole,
          must be distributed entirely under this license, and must not be
          distributed under any other license. The requirement for fonts to
          remain under this license does not apply to any document created using
          the Font Software.
        </p>
        <p>
          TERMINATION<br/>
          This license becomes null and void if any of the above conditions are not met.
        </p>
        <p>
          DISCLAIMER<br/>
          THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
          OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
          COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
          INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
          DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
          FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
          OTHER DEALINGS IN THE FONT SOFTWARE.
        </p>
        <Separator />
        <p>
          classnames<br/>
          Copyright (c) 2016 Jed Watson
        </p>
        <MITLicense />
        <Separator />
        <p>
          electron<br/>
          Copyright (c) 2015 Mathias Buus-Madsen, Max Ogden and contributors
        </p>
        <MITLicense />
        <Separator />
        <p>
          events<br/>
          MIT
        </p>
        <p>
          Copyright Joyent, Inc. and other Node contributors.
        </p>
        <MITLicense />
        <Separator />
        <p>
          node-sass<br/>
          Copyright (c) 2013-2016 Andrew Nesbitt
        </p>
        <MITLicense />
        <Separator />
        <p>
          React<br/>
          For React software
        </p>
        <p>
          Copyright (c) 2013-present, Facebook, Inc.<br/>
          All rights reserved.
        </p>
        <p>
          Redistribution and use in source and binary forms, with or without
          modification, are permitted provided that the following conditions are
          met:
        </p>
        <p>
          * Redistributions of source code must retain the above copyright
          notice, this list of conditions and the following disclaimer.
        </p>
        <p>
          * Redistributions in binary form must reproduce the above copyright
          notice, this list of conditions and the following disclaimer in the
          documentation and/or other materials provided with the distribution.
        </p>
        <p>
          * Neither the name Facebook nor the names of its contributors may be
          used to endorse or promote products derived from this software without
          specific prior written permission.
        </p>
        <p>
          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
          "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
          LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
          A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
          HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
          SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
          LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES LOSS OF USE,
          DATA, OR PROFITS OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
          THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
          (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
          OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        </p>
        <Separator />
        <p>
          react-custom-scrollbars<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2015 react-custom-scrollbars
        </p>
        <MITLicense />
        <Separator />
        <p>
          react-markdown<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2015 Espen Hovlandsdal
        </p>
        <MITLicense />
        <Separator />
        <p>
          react-portal<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2016 Vojtech Miksu
        </p>
        <MITLicense />
        <Separator />
        <p>
          react-progress-arc<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2015 Jake Pyne
        </p>
        <MITLicense />
        <Separator />
        <p>
          React Redux<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2015-present Dan Abramov
        </p>
        <MITLicense />
        <Separator />
        <p>
          Redux<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2015-present Dan Abramov
        </p>
        <MITLicense />
        <Separator />
        <p>
          Redux Thunk<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2015 Dan Abramov
        </p>
        <MITLicense />
        <Separator />
        <p>
          Reselect<br/>
          The MIT License (MIT)
        </p>
        <p>
          Copyright (c) 2015-2016 Reselect Contributors
        </p>
        <MITLicense />
        <Separator />
        <p>
          semver<br/>
          The ISC License
        </p>
        <p>
          Copyright (c) Isaac Z. Schlueter and Contributors
        </p>
        <p>
          Permission to use, copy, modify, and/or distribute this software for
          any purpose with or without fee is hereby granted, provided that the
          above copyright notice and this permission notice appear in all
          copies.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
          WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
          WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE
          AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL
          DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR
          PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
          TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
          PERFORMANCE OF THIS SOFTWARE.
        </p>
        <Separator />
        <p>
          tslib<br/>
          Copyright (c) Microsoft Corporation. All rights reserved.<br/>
          Licensed under the Apache License, Version 2.0 (the "License") you
          may not use this file except in compliance with the License. You may
          obtain a copy of the License at
          http://www.apache.org/licenses/LICENSE-2.0
        </p>
        <p>
          THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR
          CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT
          LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR
          A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT.
        </p>
        <p>
          See the Apache Version 2.0 License for specific language governing
          permissions and limitations under the License.
        </p>
        <Separator />
        <p>
          typescript<br/>
          Copyright (c) Microsoft Corporation. All rights reserved.<br/>
          Licensed under the Apache License, Version 2.0 (the "License") you
          may not use this file except in compliance with the License. You may
          obtain a copy of the License at
          http://www.apache.org/licenses/LICENSE-2.0
        </p>
        <p>
          THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR
          CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT
          LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR
          A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT.
        </p>
        <p>
          See the Apache Version 2.0 License for specific language governing
          permissions and limitations under the License.
        </p>
      </div>
    </Scroll>
  </Page>
)
