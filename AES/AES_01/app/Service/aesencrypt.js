/**
 * Created by shannon_z on 12/12/16.
 */

myApp.service("aseencrypt",function () {
    var accumulated_output_info="";
    var S_enc = [
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
        0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
        0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
        0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
        0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
        0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
        0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
        0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
        0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
        0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
        0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
        0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
        0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
        0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
        0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
        0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
        0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];

    function cvt_byte( str )
    {
        var val1 = str.charCodeAt(0);
        if ( val1 >= 48 && val1 <= 57 )
            val1 -= 48;
        else if ( val1 >= 65 && val1 <= 70 )
            val1 -= 55;
        else if ( val1 >= 97 && val1 <= 102 )
            val1 -= 87;

        // get the second hex digit
        var val2 = str.charCodeAt(1);

        if ( val2 >= 48 && val2 <= 57 )
            val2 -= 48;
        else if ( val2 >= 65 && val2 <= 70 )
            val2 -= 55;
        else if ( val2 >= 97 && val2 <= 102 )
            val2 -= 87;

        // all is ok, return the value
        return val1*16 + val2;
    }

    function get_value(str)
    {
        var dbyte = new Array(16);
        var i;
        var val;	// one hex digit

        for( i=0; i<16; i++ )
        {
            // isolate and convert this substring
            dbyte[i] = cvt_byte( str.toString().substr(i*2,2) );
            if( dbyte[i] < 0 )
            {
                // have an error
                dbyte[0] = -1;
                return dbyte;
            }
        } // for i
        return dbyte;
    } // if isASCII


    function aes_mul( a, b )
    {
        var res = 0;

        while( a > 0 )
        {
            if ( (a&1) != 0 )
                res = res ^ b;		// "add" to the result
            a >>>= 1;			// shift a to get next higher-order bit
            b <<= 1;			// shift multiplier also
        }

        // now reduce it modulo x**8 + x**4 + x**3 + x + 1
        var hbit = 0x10000;		// bit to test if we need to take action
        var modulus = 0x11b00;	// modulus - XOR by this to change value
        while( hbit >= 0x100 )
        {
            if ( (res & hbit) != 0 )		// if the high-order bit is set
                res ^= modulus;	// XOR with the modulus

            // prepare for the next loop
            hbit >>= 1;
            modulus >>= 1;
        }

        return res;
    }
    function cvt_hex8( val )
    {
        var vh = (val>>>4)&0x0f;
        return vh.toString(16) + (val&0x0f).toString(16);
    }
    function SubWord( word_ary )
    {
        var i;

        for( i=0; i<16; i++ )
            word_ary[i] = S_enc[ word_ary[i] ];

        return word_ary;
    }
    // do S-Box substitution
    function SubBytes(state, Sbox)
    {
        var i;

        for( i=0; i<16; i++ )
            state[i] = Sbox[ state[i] ];

        return state;
    }

    // shift each row as appropriate
    function ShiftRows(state)
    {
        var t0, t1, t2, t3;

        // top row (row 0) isn't shifted

        // next row (row 1) rotated left 1 place
        t0 = state[I10];
        t1 = state[I11];
        t2 = state[I12];
        t3 = state[I13];
        state[I10] = t1;
        state[I11] = t2;
        state[I12] = t3;
        state[I13] = t0;

        // next row (row 2) rotated left 2 places
        t0 = state[I20];
        t1 = state[I21];
        t2 = state[I22];
        t3 = state[I23];
        state[I20] = t2;
        state[I21] = t3;
        state[I22] = t0;
        state[I23] = t1;

        // bottom row (row 3) rotated left 3 places
        t0 = state[I30];
        t1 = state[I31];
        t2 = state[I32];
        t3 = state[I33];
        state[I30] = t3;
        state[I31] = t0;
        state[I32] = t1;
        state[I33] = t2;

        return state;
    }

    // inverset shift each row as appropriate
    function InvShiftRows(state)
    {
        var t0, t1, t2, t3;

        // top row (row 0) isn't shifted

        // next row (row 1) rotated left 1 place
        t0 = state[I10];
        t1 = state[I11];
        t2 = state[I12];
        t3 = state[I13];
        state[I10] = t3;
        state[I11] = t0;
        state[I12] = t1;
        state[I13] = t2;

        // next row (row 2) rotated left 2 places
        t0 = state[I20];
        t1 = state[I21];
        t2 = state[I22];
        t3 = state[I23];
        state[I20] = t2;
        state[I21] = t3;
        state[I22] = t0;
        state[I23] = t1;

        // bottom row (row 3) rotated left 3 places
        t0 = state[I30];
        t1 = state[I31];
        t2 = state[I32];
        t3 = state[I33];
        state[I30] = t1;
        state[I31] = t2;
        state[I32] = t3;
        state[I33] = t0;

        return state;
    }

    // process column info
    function MixColumns(state)
    {
        var col;
        var c0, c1, c2, c3;

        for( col=0; col<4; col++ )
        {
            c0 = state[I(0,col)];
            c1 = state[I(1,col)];
            c2 = state[I(2,col)];
            c3 = state[I(3,col)];

            // do mixing, and put back into array
            state[I(0,col)] = aes_mul(2,c0) ^ aes_mul(3,c1) ^ c2 ^ c3;
            state[I(1,col)] = c0 ^ aes_mul(2,c1) ^ aes_mul(3,c2) ^ c3;
            state[I(2,col)] = c0 ^ c1 ^ aes_mul(2,c2) ^ aes_mul(3,c3);
            state[I(3,col)] = aes_mul(3,c0) ^ c1 ^ c2 ^ aes_mul(2,c3);
        }

        return state;
    }

    // inverse process column info
    function InvMixColumns(state)
    {
        var col;
        var c0, c1, c2, c3;

        for( col=0; col<4; col++ )
        {
            c0 = state[I(0,col)];
            c1 = state[I(1,col)];
            c2 = state[I(2,col)];
            c3 = state[I(3,col)];

            // do inverse mixing, and put back into array
            state[I(0,col)] = aes_mul(0x0e,c0) ^ aes_mul(0x0b,c1)
                ^ aes_mul(0x0d,c2) ^ aes_mul(0x09,c3);
            state[I(1,col)] = aes_mul(0x09,c0) ^ aes_mul(0x0e,c1)
                ^ aes_mul(0x0b,c2) ^ aes_mul(0x0d,c3);
            state[I(2,col)] = aes_mul(0x0d,c0) ^ aes_mul(0x09,c1)
                ^ aes_mul(0x0e,c2) ^ aes_mul(0x0b,c3);
            state[I(3,col)] = aes_mul(0x0b,c0) ^ aes_mul(0x0d,c1)
                ^ aes_mul(0x09,c2) ^ aes_mul(0x0e,c3);
        }

        return state;
    }

    // insert subkey information
    function AddRoundKey( state, w, base )
    {
        var col;

        for( col=0; col<4; col++ )
        {
            state[I(0,col)] ^= w[base+col*4];
            state[I(1,col)] ^= w[base+col*4+1];
            state[I(2,col)] ^= w[base+col*4+2];
            state[I(3,col)] ^= w[base+col*4+3];
        }

        return state;
    }
    // convert two-dimensional indices to one-dim array indices
    var I00 = 0;
    var I01 = 1;
    var I02 = 2;
    var I03 = 3;
    var I10 = 4;
    var I11 = 5;
    var I12 = 6;
    var I13 = 7;
    var I20 = 8;
    var I21 = 9;
    var I22 = 10;
    var I23 = 11;
    var I30 = 12;
    var I31 = 13;
    var I32 = 14;
    var I33 = 15;
    function I(x,y)
    { return (x*4) + y; }
    // rotate the bytes in a word
    function RotWord( word_ary )
    {
        return new Array( word_ary[1], word_ary[2], word_ary[3], word_ary[0] );
    }

    // calculate the first item Rcon[i] = { x^(i-1), 0, 0, 0 }
    // note we only return the first item
    function Rcon( exp )
    {
        var val = 2;
        var result = 1;

        // remember to calculate x^(exp-1)
        exp--;

        // process the exponent using normal shift and multiply
        while ( exp > 0 )
        {
            if ( (exp & 1) != 0 )
                result = aes_mul( result, val );

            // square the value
            val = aes_mul( val, val );

            // move to the next bit
            exp >>= 1;
        }

        return result;
    }
    function accumulate_wordarray( label, ary )
    {
        var i, j;
        accumulated_output_info += label + " ";

        // process the four elements in this word
        for( j=0; j<4; j++ )
            accumulated_output_info += " " + cvt_hex8( ary[j] );

        // mark the end of the word
        accumulated_output_info += "\n";
    }

    function key_expand( key )
    {
        var temp = new Array(4);
        var i, j;
        var w = new Array( 4*11 );

        // copy initial key stuff
        for( i=0; i<16; i++ )
        {
            w[i] = key[i];
        }
        accumulate_wordarray( "w[0] = ", w.slice(0,4) );
        accumulate_wordarray( "w[1] = ", w.slice(4,8) );
        accumulate_wordarray( "w[2] = ", w.slice(8,12) );
        accumulate_wordarray( "w[3] = ", w.slice(12,16) );

        // generate rest of key schedule using 32-bit words
        i = 4;
        while ( i < 44 )		// blocksize * ( rounds + 1 )
        {
            // copy word W[i-1] to temp
            for( j=0; j<4; j++ )
                temp[j] = w[(i-1)*4+j];

            if ( i % 4 == 0)
            {
                // temp = SubWord(RotWord(temp)) ^ Rcon[i/4];
                temp = RotWord( temp );
                accumulate_wordarray( "RotWord()=", temp );
                temp = SubWord( temp );
                accumulate_wordarray( "SubWord()=", temp );
                temp[0] ^= Rcon( i>>>2 );
                accumulate_wordarray( " ^ Rcon()=", temp );
            }

            // word = word ^ temp
            for( j=0; j<4; j++ )
                w[i*4+j] = w[(i-4)*4+j] ^ temp[j];
            accumulate_wordarray( "w["+i+"] = ", w.slice( i*4, i*4+4 ) );

            i++;
        }

        return w;
    }

    function accumulate_array( label, ary )
    {
        var i, j;
        var spacer="";

        // build a set of spaces of equal length to the label
        while( spacer.length < label.length )
            spacer += " ";

        // build the table
        for( i=0; i<16; i+= 4 )
        {
            // add label/spaces
            if ( i== 0 )
                accumulated_output_info += label + " ";
            else
                accumulated_output_info += spacer + " ";

            // process the four elements in this "row"
            for( j=0; j<4; j++ )
                accumulated_output_info += " " + cvt_hex8( ary[i+j] );

            // mark the end of this row
            accumulated_output_info += "\n";
        }
    }
    function transpose( msg )
    {
        var row, col;
        var state = new Array( 16 );

        for( row=0; row<4; row++ )
            for( col=0; col<4; col++ )
                state[I(row,col)] = msg[I(col,row)];

        return state;
    }
    function AddRoundKey( state, w, base )
    {
        var col;

        for( col=0; col<4; col++ )
        {
            state[I(0,col)] ^= w[base+col*4];
            state[I(1,col)] ^= w[base+col*4+1];
            state[I(2,col)] ^= w[base+col*4+2];
            state[I(3,col)] ^= w[base+col*4+3];
        }

        return state;
    }

    this.aes_mul = function aes_mul(a,b){
    };

    this.aes_encrypt = function aes_encrypt(input,key)
    {
        var w = new Array( 44 );			// subkey information
        var state = new Array( 16 );			// working state
        var round;

        accumulated_output_info = "";

        // get the message from the user
        // also check if it is ASCII or hex
        // TODO get value
        var msg =  get_value(input);

        accumulate_array( "Input bits", msg );

        var key01 = get_value(key);

        accumulate_array( "Key bits", key );

        // expand the key
        w = key_expand( key01 );

        // initial state = message in columns (transposed from what we input)
        state = transpose( msg );

        accumulate_array( "Initial state", state );
        // display the round key - Transpose due to the way it is stored/used
        accumulate_array( "Round Key", transpose(w.slice( 0, 16 )) );

        this.result = [];
        this.result.push(angular.copy(state));

        state = AddRoundKey(state, w, 0);
        this.result.push(angular.copy(state));

        this.subbytes = [];
        this.shiftrows = [];
        this.mixcolumns = [];
        for( round=1; round<10; round++ )
        {
            accumulate_array( "Round " + round, state );
            state = SubBytes(state, S_enc);
            this.subbytes.push(angular.copy(state));
            accumulate_array( "After SubBytes", state );

            state = ShiftRows(state);
            this.shiftrows.push(angular.copy(state));
            accumulate_array( "After ShiftRows", state );

            state = MixColumns(state);
            this.mixcolumns.push(angular.copy(state));
            accumulate_array( "After MixColumns", state );

            // display the round key - Transpose due to the way it is stored/used
            accumulate_array( "Round Key", transpose(w.slice( round*4*4, round*16+16 )) );
            // note here the spec uses 32-bit words, we are using bytes, so an extra *4
            state = AddRoundKey(state, w, round*4*4);
            this.result.push(angular.copy(state));
        }

        SubBytes(state, S_enc);
        this.subbytes.push(angular.copy(state));
        accumulate_array( "After SubBytes", state );
        ShiftRows(state);
        this.shiftrows.push(angular.copy(state));
        accumulate_array( "After ShiftRows", state );
        AddRoundKey(state, w, 10*4*4);
        accumulate_array( "Output", state );
        this.result.push(angular.copy(state));

        // process output
        AES_output = transpose( state );
        this.value = accumulated_output_info;
        this.w = w;
    }
});