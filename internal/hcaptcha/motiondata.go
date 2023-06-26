package hcaptcha

import (
	"encoding/json"
	"fmt"
	"image/color"
	"math/rand"
	"time"

	"github.com/0xF7A4C6/implex/internal/utils"
	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/vg"
)

var boxes = map[int]Box{
	0: {Start: Point{131, 282, 0}, End: Point{177, 310, 0}},
	1: {Start: Point{250, 274, 0}, End: Point{313, 318, 0}},
	2: {Start: Point{390, 274, 0}, End: Point{438, 324, 0}},
	3: {Start: Point{122, 408, 0}, End: Point{187, 456, 0}},
	4: {Start: Point{250, 400, 0}, End: Point{314, 451, 0}},
	5: {Start: Point{386, 400, 0}, End: Point{448, 466, 0}},
	6: {Start: Point{124, 530, 0}, End: Point{188, 584, 0}},
	7: {Start: Point{250, 539, 0}, End: Point{313, 588, 0}},
	8: {Start: Point{387, 537, 0}, End: Point{446, 579, 0}},
}

// Returns a random point within the given box.
func RandomPointInBox(box Box) Point {
	const minDiff = 1
	xDiff := box.End.X - box.Start.X
	if xDiff < 0 {
		xDiff = -xDiff
	}
	yDiff := box.End.Y - box.Start.Y
	if yDiff < 0 {
		yDiff = -yDiff
	}
	return Point{
		X: box.Start.X + rand.Int63n(xDiff+minDiff),
		Y: box.Start.Y + rand.Int63n(yDiff+minDiff),
		T: time.Now().UnixNano() / 1e6,
	}
}

func calculateBezier(t float64, start, ctrl1, ctrl2, end int64) int64 {
	u := 1.0 - t
	tt := t * t
	uu := u * u
	uuu := uu * u
	ttt := tt * t

	res := uuu*float64(start) + 3*uu*t*float64(ctrl1) + 3*u*tt*float64(ctrl2) + ttt*float64(end)
	return int64(res)
}

// Function to generate points along the Bezier curve
func GenerateMousePath(start, end Point, numPoints int) []Point {
	const minDiff = 1
	deltaX := abs(end.X - start.X)
	if deltaX < minDiff {
		deltaX = minDiff
	}
	deltaY := abs(end.Y - start.Y)
	if deltaY < minDiff {
		deltaY = minDiff
	}

	ctrl1 := Point{
		X: start.X + max(rand.Int63n(max((end.X-start.X)/2, minDiff)), minDiff),
		Y: start.Y + max(rand.Int63n(max((end.Y-start.Y)/2, minDiff)), minDiff),
		T: start.T + (end.T-start.T)/4,
	}
	ctrl2 := Point{
		X: ctrl1.X + max(rand.Int63n(max((end.X-ctrl1.X)/2, minDiff)), minDiff),
		Y: ctrl1.Y + max(rand.Int63n(max((end.Y-ctrl1.Y)/2, minDiff)), minDiff),
		T: ctrl1.T + (end.T-ctrl1.T)/2,
	}

	var path []Point
	for i := 0; i < numPoints; i++ {
		t := float64(i) / float64(numPoints-1)
		X := calculateBezier(t, start.X, ctrl1.X, ctrl2.X, end.X)
		Y := calculateBezier(t, start.Y, ctrl1.Y, ctrl2.Y, end.Y)
		T := int64((1.0-t)*float64(start.T) + t*float64(end.T))
		path = append(path, Point{X, Y, T})
	}

	return path
}

func max(a, b int64) int64 {
	if a > b {
		return a
	}
	return b
}

func abs(a int64) int64 {
	if a < 0 {
		return -a
	}
	return a
}

func PlotPoints(points [][]int64) {
	var path []Point

	for _, p := range points {
		path = append(path, Point{
			X: int64(p[0]),
			Y: int64(p[1]),
			T: int64(p[2]),
		})
	}

	p := plot.New()

	p.Title.Text = "Mouse Path"
	p.X.Label.Text = "X"
	p.Y.Label.Text = "Y"

	pts := make(plotter.XYs, len(path))
	for i, point := range path {
		pts[i].X = float64(point.X)
		pts[i].Y = float64(point.Y)
	}

	minX, maxX, minY, maxY := pts[0].X, pts[0].X, pts[0].Y, pts[0].Y
	for _, point := range pts[1:] {
		if point.X < minX {
			minX = point.X
		}
		if point.X > maxX {
			maxX = point.X
		}
		if point.Y < minY {
			minY = point.Y
		}
		if point.Y > maxY {
			maxY = point.Y
		}
	}

	p.X.Min = minX - 1
	p.X.Max = maxX + 1
	p.Y.Min = minY - 1
	p.Y.Max = maxY + 1

	s, err := plotter.NewScatter(pts)
	if err != nil {
		panic(err)
	}

	s.GlyphStyle.Color = color.RGBA{R: 255, B: 128, A: 255}

	l, err := plotter.NewLine(pts)
	if err != nil {
		panic(err)
	}

	l.LineStyle.Width = vg.Points(1)
	l.LineStyle.Dashes = []vg.Length{vg.Points(5), vg.Points(5)}
	l.LineStyle.Color = color.RGBA{B: 255, A: 255}

	p.Add(s, l)

	if err := p.Save(4*vg.Inch, 4*vg.Inch, fmt.Sprintf("%s.png", utils.RandomString(10))); err != nil {
		panic(err)
	}

	fmt.Println("Plot saved to mouse_path.png")
}

func Point2path(p []Point) [][]int64 {
	convertedPath := make([][]int64, len(p))

	for i, point := range p {
		convertedPath[i] = []int64{point.X, point.Y, point.T}
	}

	return convertedPath
}

// Function takes boxes to be clicked
func Click(boxesToClick []int, startTime, duration int64, curveAmount int) [][]int64 {
	var path []Point
	timeIncrement := duration / int64(len(boxesToClick))

	for i, boxNum := range boxesToClick {
		box := boxes[boxNum]
		targetPoint := RandomPointInBox(box)
		targetPoint.T = startTime + timeIncrement*int64(i)

		if i > 0 {
			intermediatePath := GenerateMousePath(path[len(path)-1], targetPoint, curveAmount)
			timeDiff := targetPoint.T - path[len(path)-1].T

			for j, point := range intermediatePath {
				point.T = path[len(path)-1].T + timeDiff*int64(j)/int64(len(intermediatePath))
				intermediatePath[j] = point
			}
			path = append(path, intermediatePath...)
		}

		path = append(path, targetPoint)
	}

	return Point2path(path)
}

func addTime(st int64, toAdd time.Duration) int64 {
	return st + toAdd.Milliseconds()
}

func RandomNumber(a, b int) int {
	if a >= b {
		panic("Invalid range: a must be less than b")
	}

	rand.New(rand.NewSource(time.Now().UnixNano()))
	return rand.Intn(b-a+1) + a
}

func GetRandomBox() Box {
	boxIDs := make([]int, 0, len(boxes))
	for boxID := range boxes {
		boxIDs = append(boxIDs, boxID)
	}

	rand.New(rand.NewSource(time.Now().UnixNano()))
	randomIndex := rand.Intn(len(boxIDs))
	randomBoxID := boxIDs[randomIndex]

	return boxes[randomBoxID]
}

func getTrueItems(data map[string]string) []int {
	trueItems := make([]int, 0)
	if len(data) == 0 {
		return trueItems
	}

	i := 0
	for _, value := range data {
		if value == "true" {
			trueItems = append(trueItems, i)
		}
		i++
	}
	return trueItems
}

func calculateMeanPeriod(events [][]int64) float64 {
	var timeDifferences []int64
	for i := 0; i < len(events)-1; i++ {
		timeDifference := events[i+1][2] - events[i][2]
		timeDifferences = append(timeDifferences, timeDifference)
	}
	var sum int64 = 0
	for _, timeDifference := range timeDifferences {
		sum += timeDifference
	}
	meanPeriod := float64(sum) / float64(len(timeDifferences))
	return meanPeriod
}

// generateRandomBrowserSize generates a random browser width and height. minSize and maxSize specify the range of possible values.
func generateRandomBrowserSize(minSize, maxSize int) (width, height int64) {
	aspectRatios := []float64{16.0 / 9.0, 16.0 / 10.0, 4.0 / 3.0}

	rand.Shuffle(len(aspectRatios), func(i, j int) {
		aspectRatios[i], aspectRatios[j] = aspectRatios[j], aspectRatios[i]
	})

	aspectRatio := aspectRatios[0]

	width = int64(rand.Intn(maxSize-minSize+1) + minSize)
	height = int64(float64(width) / aspectRatio)

	return width, height
}

func GenerateMotionCheck(answers map[string]string, w, h int64) string {
	st := time.Now().UnixNano() / 1e6
	duration := int64(RandomNumber(1000, 5000))

	var items []int
	if len(answers) != 0 {
		items = getTrueItems(answers)
	} else {
		items = []int{RandomNumber(0, 8), RandomNumber(0, 8), RandomNumber(0, 8)}
	}

	if len(items) < 2 {
		items = []int{RandomNumber(0, 8), RandomNumber(0, 8), RandomNumber(0, 8)}
	}

	path := Click(items, st, duration, RandomNumber(10, 30))

	p2 := Click([]int{RandomNumber(0, 8), RandomNumber(0, 8), RandomNumber(0, 8)}, st, int64(RandomNumber(1000, 3000)), RandomNumber(8, 16))
	p3 := Click([]int{RandomNumber(0, 8), RandomNumber(0, 8), RandomNumber(0, 8)}, st, int64(RandomNumber(1000, 3000)), RandomNumber(3, 10))
	p5 := Click([]int{RandomNumber(0, 8), RandomNumber(0, 8), RandomNumber(0, 8)}, st, int64(RandomNumber(1000, 3000)), RandomNumber(10, 20))

	PlotPoints(path)

	t := time.Duration(RandomNumber(100, 200)) * time.Millisecond

	m, _ := json.Marshal(&Data{
		St:   st,
		Dct:  st,
		Mm:   path,
		MmMp: calculateMeanPeriod(path),
		Md:   p2,
		MdMp: calculateMeanPeriod(p2),
		Mu:   p3,
		MuMp: calculateMeanPeriod(p3),
		TopLevel: TopLevel{
			St: st,
			Sc: Sc{
				AvailWidth:  w * 2,
				AvailHeight: h * 2,
				Width:       w * 2,
				Height:      h * 2,
				ColorDepth:  24,
				PixelDepth:  24,
				AvailLeft:   0,
				AvailTop:    0,
				Onchange:    nil,
				IsExtended:  true,
			},
			Nv: Nv{
				HardwareConcurrency: 16,
				DeviceMemory:        8,
				Webdriver:           false,
				MaxTouchPoints:      0,
				CookieEnabled:       true,
				AppCodeName:         "Mozilla",
				AppName:             "Netscape",
				AppVersion:          "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
				Platform:            "Win32",
				Product:             "Gecko",
				ProductSub:          "20030107",
				UserAgent:           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
				Vendor:              "Google Inc.",
				VendorSub:           "",
				Language:            "fr-FR",
				Languages: []string{
					"fr-FR", "fr", "en-US", "en",
				},
				OnLine:           true,
				PDFViewerEnabled: true,
				DoNotTrack:       nil,
				Plugins:          []string{"internal-pdf-viewer", "internal-pdf-viewer", "internal-pdf-viewer", "internal-pdf-viewer", "internal-pdf-viewer"},
				UserAgentData: UserAgentData{
					Brands: []Brand{
						{
							Brand:   "Chromium",
							Version: "114",
						},
						{
							Brand:   "Google Chrome",
							Version: "114",
						},
						{
							Brand:   "Not:A-Brand",
							Version: "8",
						},
					},
					Mobile:   false,
					Platform: "Windows",
				},
			},
			DR:   "",
			Inv:  false,
			Exec: false,
			Wn: [][]int64{
				{
					w,              // mt.Browser.width()   // ---> return window.innerWidth && window.document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || window.document.documentElement.clientWidth || document.body.clientWidth;
					h,              // mt.Browser.height()  // ---> return window.innerHeight || window.document.documentElement.clientHeight || document.body.clientHeight;
					1,              // mt.System.dpr()
					addTime(st, t), // Date.now()
				},
			},
			WnMp: 0,
			Xy: [][]int64{
				{
					0,              // mt.Browser.scrollX(),  // ---> return window.pageXOffset !== undefined ? window.pageXOffset : t.isCSS1 ? document.documentElement.scrollLeft : document.body.scrollLeft;
					0,              // mt.Browser.scrollY(),  // ---> return window.pageYOffset !== undefined ? window.pageYOffset : t.isCSS1 ? document.documentElement.scrollTop : document.body.scrollTop;
					w / (w * 2),    // document.documentElement.clientWidth / mt.Browser.width(),
					addTime(st, t), // Date.now()
				},
			},
			XyMp: 0,
			Mm:   p5,
			MmMp: calculateMeanPeriod(p5),
		},
		V: 1,
	})

	return string(m)
}

func GenerateMotionGet(w, h int64) string {
	st := time.Now().UnixNano() / 1e6
	duration := int64(RandomNumber(300, 3500))

	path := Click([]int{RandomNumber(0, 8), RandomNumber(0, 8)}, st, duration, 14)

	p2 := Click([]int{RandomNumber(0, 8), RandomNumber(0, 8)}, st, int64(RandomNumber(100, 1500)), 2)
	p3 := Click([]int{RandomNumber(0, 8), RandomNumber(0, 8)}, st, int64(RandomNumber(100, 1500)), RandomNumber(2, 5))
	p7 := Click([]int{RandomNumber(0, 8), RandomNumber(0, 8)}, st, int64(RandomNumber(100, 1500)), RandomNumber(2, 18))

	//PlotPoints(path)

	id := utils.RandomString(12)
	t := time.Duration(RandomNumber(100, 200)) * time.Millisecond

	m, _ := json.Marshal(&GetData{
		St:   st,
		Mm:   path,
		MmMp: calculateMeanPeriod(path),
		Md:   p2,
		MdMp: int64(calculateMeanPeriod(p2)),
		Mu:   p3,
		MuMp: int64(calculateMeanPeriod(p3)),
		V:    1,
		TopLevel: GetTopLevel{
			St: st,
			Sc: GetSc{
				AvailWidth:  w * 2,
				AvailHeight: h * 2,
				Width:       w * 2,
				Height:      h * 2,
				ColorDepth:  24,
				PixelDepth:  24,
				AvailLeft:   0,
				AvailTop:    0,
				Onchange:    nil,
				IsExtended:  true,
			},
			Nv: GetNv{
				HardwareConcurrency: 16,
				DeviceMemory:        8,
				Webdriver:           false,
				MaxTouchPoints:      0,
				CookieEnabled:       true,
				AppCodeName:         "Mozilla",
				AppName:             "Netscape",
				AppVersion:          "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
				Platform:            "Win32",
				Product:             "Gecko",
				ProductSub:          "20030107",
				UserAgent:           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
				Vendor:              "Google Inc.",
				VendorSub:           "",
				Language:            "fr-FR",
				Languages: []string{
					"fr-FR", "fr", "en-US", "en",
				},
				OnLine:           true,
				PDFViewerEnabled: true,
				DoNotTrack:       nil,
				Plugins:          []string{"internal-pdf-viewer", "internal-pdf-viewer", "internal-pdf-viewer", "internal-pdf-viewer", "internal-pdf-viewer"},
				UserAgentData: UserAgentData{
					Brands: []Brand{
						{
							Brand:   "Chromium",
							Version: "114",
						},
						{
							Brand:   "Google Chrome",
							Version: "114",
						},
						{
							Brand:   "Not:A-Brand",
							Version: "8",
						},
					},
					Mobile:   false,
					Platform: "Windows", // MacIntel
				},
			},
			DR:   "",
			Inv:  false,
			Exec: false,
			Wn: [][]int64{
				{
					w,              // mt.Browser.width()   // ---> return window.innerWidth && window.document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || window.document.documentElement.clientWidth || document.body.clientWidth;
					h,              // mt.Browser.height()  // ---> return window.innerHeight || window.document.documentElement.clientHeight || document.body.clientHeight;
					1,              // mt.System.dpr()
					addTime(st, t), // Date.now()
				},
			},
			WnMp: 0,
			Xy: [][]int64{
				{
					0,              // mt.Browser.scrollX(),  // ---> return window.pageXOffset !== undefined ? window.pageXOffset : t.isCSS1 ? document.documentElement.scrollLeft : document.body.scrollLeft;
					0,              // mt.Browser.scrollY(),  // ---> return window.pageYOffset !== undefined ? window.pageYOffset : t.isCSS1 ? document.documentElement.scrollTop : document.body.scrollTop;
					w / (w * 2),    // document.documentElement.clientWidth / mt.Browser.width(),
					addTime(st, t), // Date.now()
				},
			},
			XyMp: 0,
			Mm:   p7,
			MmMp: calculateMeanPeriod(p7),
		},
		Session: []string{},
		WidgetList: []string{
			id,
		},
		WidgetID: id,
		Href:     "https://discord.com/",
		Prev: GetPrev{
			Escaped:          false,
			Passed:           false,
			ExpiredChallenge: false,
			ExpiredResponse:  false,
		},
	})

	return string(m)
}
